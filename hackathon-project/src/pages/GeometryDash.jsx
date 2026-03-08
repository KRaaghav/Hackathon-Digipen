import React, { useEffect, useMemo, useRef, useState } from 'react'

const GAME_WIDTH = 900
const GAME_HEIGHT = 320
const FLOOR_HEIGHT = 40

const PLAYER_SIZE = 26
const PLAYER_X = 110

const GRAVITY = 0.92
const JUMP_VELOCITY = -13
const SCROLL_SPEED = 7.5

const PLATFORM_MIN_WIDTH = 105
const PLATFORM_MAX_WIDTH = 180

const SPIKE_WIDTH = 24
const SPIKE_HEIGHT = 24

const START_BUFFER = 280
const MIN_GAP_BETWEEN_OBSTACLES = 120
const MAX_GAP_BETWEEN_OBSTACLES = 210

const REACHABLE_PLATFORM_HEIGHTS = [34, 44, 54, 62]

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function makeDecor() {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    id: `star-${i}`,
    x: rand(0, GAME_WIDTH),
    y: rand(18, 140),
    size: rand(2, 4),
  }))

  const bars = Array.from({ length: 7 }, (_, i) => ({
    id: `bar-${i}`,
    x: rand(0, GAME_WIDTH),
    y: rand(55, 220),
    width: rand(90, 180),
    height: rand(8, 18),
  }))

  const columns = Array.from({ length: 6 }, (_, i) => ({
    id: `col-${i}`,
    x: rand(0, GAME_WIDTH),
    width: rand(36, 72),
    height: rand(70, 150),
  }))

  return { stars, bars, columns }
}

function generateCourse(startX = GAME_WIDTH + START_BUFFER, count = 12) {
  const items = []
  let x = startX

  for (let i = 0; i < count; i++) {
    x += rand(MIN_GAP_BETWEEN_OBSTACLES, MAX_GAP_BETWEEN_OBSTACLES)

    const roll = Math.random()

    if (roll < 0.42) {
      items.push({
        id: `spike-${startX}-${i}`,
        type: 'spike',
        x,
        y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
        width: SPIKE_WIDTH,
        height: SPIKE_HEIGHT,
      })
      x += SPIKE_WIDTH
    } else if (roll < 0.78) {
      const width = rand(PLATFORM_MIN_WIDTH, PLATFORM_MAX_WIDTH)
      const heightOffset = pick(REACHABLE_PLATFORM_HEIGHTS)

      items.push({
        id: `platform-${startX}-${i}`,
        type: 'platform',
        x,
        y: GAME_HEIGHT - FLOOR_HEIGHT - heightOffset,
        width,
        height: 16,
      })

      if (Math.random() < 0.35) {
        x += width + rand(45, 70)
        items.push({
          id: `post-platform-spike-${startX}-${i}`,
          type: 'spike',
          x,
          y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
          width: SPIKE_WIDTH,
          height: SPIKE_HEIGHT,
        })
        x += SPIKE_WIDTH
      } else {
        x += width
      }
    } else {
      items.push({
        id: `double-a-${startX}-${i}`,
        type: 'spike',
        x,
        y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
        width: SPIKE_WIDTH,
        height: SPIKE_HEIGHT,
      })

      items.push({
        id: `double-b-${startX}-${i}`,
        type: 'spike',
        x: x + SPIKE_WIDTH + 10,
        y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
        width: SPIKE_WIDTH,
        height: SPIKE_HEIGHT,
      })

      x += SPIKE_WIDTH * 2 + 10
    }
  }

  return items
}

export default function GeometryDash() {
  const floorY = GAME_HEIGHT - FLOOR_HEIGHT

  const [playerY, setPlayerY] = useState(floorY - PLAYER_SIZE)
  const [velocityY, setVelocityY] = useState(0)
  const [items, setItems] = useState(() => generateCourse())
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [decor, setDecor] = useState(() => makeDecor())

  const jumpQueuedRef = useRef(false)
  const animationRef = useRef(null)

  const playerYRef = useRef(playerY)
  const velocityYRef = useRef(velocityY)
  const itemsRef = useRef(items)
  const isGameOverRef = useRef(isGameOver)
  const decorRef = useRef(decor)

  useEffect(() => {
    playerYRef.current = playerY
  }, [playerY])

  useEffect(() => {
    velocityYRef.current = velocityY
  }, [velocityY])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    isGameOverRef.current = isGameOver
  }, [isGameOver])

  useEffect(() => {
    decorRef.current = decor
  }, [decor])

  const player = useMemo(() => ({
    x: PLAYER_X,
    y: playerY,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
  }), [playerY])

  const resetGame = () => {
    const freshItems = generateCourse()
    const freshDecor = makeDecor()

    setPlayerY(floorY - PLAYER_SIZE)
    setVelocityY(0)
    setItems(freshItems)
    setScore(0)
    setIsGameOver(false)
    setDecor(freshDecor)

    playerYRef.current = floorY - PLAYER_SIZE
    velocityYRef.current = 0
    itemsRef.current = freshItems
    isGameOverRef.current = false
    decorRef.current = freshDecor
    jumpQueuedRef.current = false
  }

  useEffect(() => {
    const handleJump = (e) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.type === 'mousedown' ||
        e.type === 'touchstart'
      ) {
        jumpQueuedRef.current = true
      }

      if (isGameOverRef.current && e.code === 'KeyR') {
        resetGame()
      }
    }

    window.addEventListener('keydown', handleJump)
    window.addEventListener('mousedown', handleJump)
    window.addEventListener('touchstart', handleJump)

    return () => {
      window.removeEventListener('keydown', handleJump)
      window.removeEventListener('mousedown', handleJump)
      window.removeEventListener('touchstart', handleJump)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      if (isGameOverRef.current) {
        animationRef.current = requestAnimationFrame(tick)
        return
      }

      let currentY = playerYRef.current
      let currentVel = velocityYRef.current
      let currentItems = [...itemsRef.current]
      let currentDecor = {
        stars: [...decorRef.current.stars],
        bars: [...decorRef.current.bars],
        columns: [...decorRef.current.columns],
      }

      const onGround = currentY >= floorY - PLAYER_SIZE - 0.5

      if (jumpQueuedRef.current && onGround) {
        currentVel = JUMP_VELOCITY
      }
      jumpQueuedRef.current = false

      currentVel += GRAVITY
      let nextY = currentY + currentVel

      if (nextY + PLAYER_SIZE >= floorY) {
        nextY = floorY - PLAYER_SIZE
        currentVel = 0
      }

      const playerNext = {
        x: PLAYER_X,
        y: nextY,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      }

      for (const item of currentItems) {
        if (item.type !== 'platform') continue

        const wasAbove = currentY + PLAYER_SIZE <= item.y + 12
        const falling = currentVel >= 0
        const overlapsX =
          PLAYER_X + PLAYER_SIZE - 5 > item.x &&
          PLAYER_X + 5 < item.x + item.width

        if (
          falling &&
          wasAbove &&
          overlapsX &&
          playerNext.y + PLAYER_SIZE >= item.y &&
          playerNext.y + PLAYER_SIZE <= item.y + item.height + 26
        ) {
          nextY = item.y - PLAYER_SIZE
          currentVel = 0
          break
        }
      }

      currentItems = currentItems
        .map((item) => ({ ...item, x: item.x - SCROLL_SPEED }))
        .filter((item) => item.x + item.width > -100)

      const rightMost = currentItems.length
        ? Math.max(...currentItems.map((i) => i.x + i.width))
        : GAME_WIDTH

      if (rightMost < GAME_WIDTH + 250) {
        currentItems = [
          ...currentItems,
          ...generateCourse(rightMost + 70, 8),
        ]
      }

      currentDecor.stars = currentDecor.stars.map((star) => {
        let nextX = star.x - SCROLL_SPEED * 0.18
        if (nextX < -10) nextX = GAME_WIDTH + rand(0, 120)
        return { ...star, x: nextX }
      })

      currentDecor.bars = currentDecor.bars.map((bar) => {
        let nextX = bar.x - SCROLL_SPEED * 0.45
        if (nextX + bar.width < 0) {
          nextX = GAME_WIDTH + rand(20, 120)
          return {
            ...bar,
            x: nextX,
            y: rand(55, 220),
            width: rand(90, 180),
            height: rand(8, 18),
          }
        }
        return { ...bar, x: nextX }
      })

      currentDecor.columns = currentDecor.columns.map((col) => {
        let nextX = col.x - SCROLL_SPEED * 0.75
        if (nextX + col.width < 0) {
          nextX = GAME_WIDTH + rand(20, 140)
          return {
            ...col,
            x: nextX,
            width: rand(36, 72),
            height: rand(70, 150),
          }
        }
        return { ...col, x: nextX }
      })

      const playerBox = {
        x: PLAYER_X,
        y: nextY,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      }

      let hit = false
      for (const item of currentItems) {
        if (item.type === 'spike' && rectsIntersect(playerBox, item)) {
          hit = true
          break
        }
      }

      playerYRef.current = nextY
      velocityYRef.current = currentVel
      itemsRef.current = currentItems
      decorRef.current = currentDecor

      setPlayerY(nextY)
      setVelocityY(currentVel)
      setItems(currentItems)
      setDecor(currentDecor)
      setScore((s) => s + 1)

      if (hit) {
        setIsGameOver(true)
        isGameOverRef.current = true
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    animationRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #0f172a, #111827)',
        padding: 24,
      }}
    >
      <div>
        <div
          style={{
            marginBottom: 12,
            color: 'white',
            fontFamily: 'sans-serif',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>Score: {score}</div>
          <div>Space / Click to jump • R to restart</div>
        </div>

        <div
          onMouseDown={() => {
            jumpQueuedRef.current = true
          }}
          onTouchStart={() => {
            jumpQueuedRef.current = true
          }}
          style={{
            position: 'relative',
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            overflow: 'hidden',
            borderRadius: 16,
            border: '2px solid rgba(255,255,255,0.12)',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            cursor: 'pointer',
          }}
        >
          {decor.stars.map((star) => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.8)',
                boxShadow: '0 0 8px rgba(255,255,255,0.45)',
              }}
            />
          ))}

          {decor.bars.map((bar) => (
            <div
              key={bar.id}
              style={{
                position: 'absolute',
                left: bar.x,
                top: bar.y,
                width: bar.width,
                height: bar.height,
                borderRadius: 999,
                background: 'rgba(148,163,184,0.08)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            />
          ))}

          {decor.columns.map((col) => (
            <div
              key={col.id}
              style={{
                position: 'absolute',
                left: col.x,
                bottom: FLOOR_HEIGHT,
                width: col.width,
                height: col.height,
                borderRadius: '10px 10px 0 0',
                background: 'linear-gradient(180deg, rgba(71,85,105,0.35), rgba(30,41,59,0.65))',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: FLOOR_HEIGHT,
              background: 'linear-gradient(180deg, #334155, #1e293b)',
              borderTop: '3px solid #94a3b8',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: -(score % 40),
              bottom: FLOOR_HEIGHT - 10,
              width: GAME_WIDTH + 40,
              height: 10,
              background:
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 24px, transparent 24px 40px)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: PLAYER_X,
              top: player.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              background: isGameOver ? '#ef4444' : '#22c55e',
              borderRadius: 6,
              boxShadow: '0 0 20px rgba(34,197,94,0.35)',
            }}
          />

          {items.map((item) => {
            if (item.type === 'platform') {
              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                    background: 'linear-gradient(180deg, #f8fafc, #cbd5e1)',
                    borderRadius: 8,
                    boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.35)',
                  }}
                />
              )
            }

            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  width: 0,
                  height: 0,
                  borderLeft: `${item.width / 2}px solid transparent`,
                  borderRight: `${item.width / 2}px solid transparent`,
                  borderBottom: `${item.height}px solid #ef4444`,
                  filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.35))',
                }}
              />
            )
          })}

          {isGameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
              }}
            >
              <h2 style={{ fontSize: 32, marginBottom: 8 }}>Game Over</h2>
              <p style={{ marginBottom: 16 }}>Press R to restart</p>
              <button
                onClick={resetGame}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#22c55e',
                  color: '#08110b',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Restart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}