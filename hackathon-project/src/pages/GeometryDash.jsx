import React, { useEffect, useMemo, useRef, useState } from 'react'

const GAME_WIDTH = 900
const GAME_HEIGHT = 320
const FLOOR_HEIGHT = 40

const PLAYER_SIZE = 28
const PLAYER_X = 120

const GRAVITY = 0.95
const JUMP_VELOCITY = -13.2
const SCROLL_SPEED = 8.2

const PLATFORM_MIN_WIDTH = 80
const PLATFORM_MAX_WIDTH = 160
const BLOCK_SIZE = 32

const SPIKE_WIDTH = 22
const SPIKE_HEIGHT = 22
const CEILING_SPIKE_HEIGHT = 20

const START_BUFFER = 300
const MIN_GAP = 100
const MAX_GAP = 200

const REACHABLE_HEIGHTS = [30, 42, 52, 60]

// GD-style colors
const COLORS = {
  bg: 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)',
  floor: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
  floorLine: '#2d2d4a',
  cube: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
  cubeFace: '#e0f7ff',
  spike: 'linear-gradient(180deg, #ff3366 0%, #cc0044 100%)',
  spikeGlow: 'rgba(255,51,102,0.5)',
  platform: 'linear-gradient(180deg, #3d3d5c 0%, #2a2a45 100%)',
  block: 'linear-gradient(180deg, #4a4a6a 0%, #323250 100%)',
  gridLight: 'rgba(255,255,255,0.06)',
  gridDark: 'rgba(255,255,255,0.02)',
}

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
  const stars = Array.from({ length: 24 }, (_, i) => ({
    id: `star-${i}`,
    x: rand(0, GAME_WIDTH),
    y: rand(10, 130),
    size: rand(1, 3),
    opacity: 0.4 + Math.random() * 0.5,
  }))
  const bars = Array.from({ length: 8 }, (_, i) => ({
    id: `bar-${i}`,
    x: rand(0, GAME_WIDTH),
    y: rand(50, 200),
    width: rand(80, 160),
    height: rand(6, 14),
  }))
  const columns = Array.from({ length: 8 }, (_, i) => ({
    id: `col-${i}`,
    x: rand(0, GAME_WIDTH),
    width: rand(32, 60),
    height: rand(60, 140),
  }))
  return { stars, bars, columns }
}

function generateCourse(startX = GAME_WIDTH + START_BUFFER, count = 14) {
  const items = []
  let x = startX

  for (let i = 0; i < count; i++) {
    x += rand(MIN_GAP, MAX_GAP)
    const roll = Math.random()

    if (roll < 0.38) {
      const numSpikes = Math.random() < 0.4 ? 2 : 1
      for (let s = 0; s < numSpikes; s++) {
        items.push({
          id: `spike-${startX}-${i}-${s}`,
          type: 'spike',
          x: x + s * (SPIKE_WIDTH + 4),
          y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
          width: SPIKE_WIDTH,
          height: SPIKE_HEIGHT,
        })
      }
      x += numSpikes * (SPIKE_WIDTH + 4)
    } else if (roll < 0.55) {
      const width = rand(PLATFORM_MIN_WIDTH, PLATFORM_MAX_WIDTH)
      const heightOffset = pick(REACHABLE_HEIGHTS)
      items.push({
        id: `platform-${startX}-${i}`,
        type: 'platform',
        x,
        y: GAME_HEIGHT - FLOOR_HEIGHT - heightOffset,
        width,
        height: 14,
      })
      if (Math.random() < 0.3) {
        x += width + rand(40, 60)
        items.push({
          id: `post-spike-${startX}-${i}`,
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
    } else if (roll < 0.72) {
      const blockW = BLOCK_SIZE * (rand(1, 3))
      const blockH = BLOCK_SIZE * (rand(1, 2))
      items.push({
        id: `block-${startX}-${i}`,
        type: 'block',
        x,
        y: GAME_HEIGHT - FLOOR_HEIGHT - blockH,
        width: blockW,
        height: blockH,
        hasSpike: Math.random() < 0.35,
      })
      x += blockW
    } else if (roll < 0.88) {
      const w = rand(20, 36)
      items.push({
        id: `ceiling-${startX}-${i}`,
        type: 'ceilingSpike',
        x,
        y: 0,
        width: w,
        height: CEILING_SPIKE_HEIGHT,
      })
      x += w
    } else {
      items.push({
        id: `d1-${startX}-${i}`,
        type: 'spike',
        x,
        y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
        width: SPIKE_WIDTH,
        height: SPIKE_HEIGHT,
      })
      items.push({
        id: `d2-${startX}-${i}`,
        type: 'spike',
        x: x + SPIKE_WIDTH + 8,
        y: GAME_HEIGHT - FLOOR_HEIGHT - SPIKE_HEIGHT,
        width: SPIKE_WIDTH,
        height: SPIKE_HEIGHT,
      })
      x += SPIKE_WIDTH * 2 + 8
    }
  }
  return items
}

function createDeathParticles(px, py) {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: px + PLAYER_SIZE / 2,
    y: py + PLAYER_SIZE / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.5) * 14 - 4,
    life: 1,
    size: 4 + Math.random() * 6,
  }))
}

export default function GeometryDash() {
  const floorY = GAME_HEIGHT - FLOOR_HEIGHT

  const [playerY, setPlayerY] = useState(floorY - PLAYER_SIZE)
  const [velocityY, setVelocityY] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [items, setItems] = useState(() => generateCourse())
  const [score, setScore] = useState(0)
  const [decor, setDecor] = useState(() => makeDecor())
  const [isGameOver, setIsGameOver] = useState(false)
  const [deathParticles, setDeathParticles] = useState([])
  const [shake, setShake] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)

  const jumpQueuedRef = useRef(false)
  const animationRef = useRef(null)
  const playerYRef = useRef(playerY)
  const velocityYRef = useRef(velocityY)
  const rotationRef = useRef(rotation)
  const itemsRef = useRef(items)
  const isGameOverRef = useRef(isGameOver)
  const decorRef = useRef(decor)
  const totalDistanceRef = useRef(0)
  const deathParticlesRef = useRef([])

  useEffect(() => { playerYRef.current = playerY }, [playerY])
  useEffect(() => { velocityYRef.current = velocityY }, [velocityY])
  useEffect(() => { rotationRef.current = rotation }, [rotation])
  useEffect(() => { itemsRef.current = items }, [items])
  useEffect(() => { isGameOverRef.current = isGameOver }, [isGameOver])
  useEffect(() => { decorRef.current = decor }, [decor])
  useEffect(() => { totalDistanceRef.current = totalDistance }, [totalDistance])

  const resetGame = () => {
    const freshItems = generateCourse()
    const freshDecor = makeDecor()
    setPlayerY(floorY - PLAYER_SIZE)
    setVelocityY(0)
    setRotation(0)
    setItems(freshItems)
    setScore(0)
    setDecor(freshDecor)
    setIsGameOver(false)
    setDeathParticles([])
    setShake(0)
    setTotalDistance(0)
    playerYRef.current = floorY - PLAYER_SIZE
    velocityYRef.current = 0
    rotationRef.current = 0
    itemsRef.current = freshItems
    isGameOverRef.current = false
    decorRef.current = freshDecor
    totalDistanceRef.current = 0
    deathParticlesRef.current = []
    jumpQueuedRef.current = false
  }

  useEffect(() => {
    const handleJump = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.type === 'mousedown' || e.type === 'touchstart') {
        jumpQueuedRef.current = true
      }
      if (isGameOverRef.current && e.code === 'KeyR') resetGame()
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
      if (deathParticlesRef.current.length > 0) {
        deathParticlesRef.current = deathParticlesRef.current
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.6,
            life: p.life - 0.035,
          }))
          .filter((p) => p.life > 0)
        setDeathParticles([...deathParticlesRef.current])
      }

      if (isGameOverRef.current) {
        setShake((s) => Math.max(0, s - 2))
        animationRef.current = requestAnimationFrame(tick)
        return
      }

      let currentY = playerYRef.current
      let currentVel = velocityYRef.current
      let currentRot = rotationRef.current
      let currentItems = [...itemsRef.current]
      let currentDecor = {
        stars: [...decorRef.current.stars],
        bars: [...decorRef.current.bars],
        columns: [...decorRef.current.columns],
      }

      const onGround = currentY >= floorY - PLAYER_SIZE - 0.5

      if (jumpQueuedRef.current && onGround) {
        currentVel = JUMP_VELOCITY
        currentRot = 0
      }
      jumpQueuedRef.current = false

      currentVel += GRAVITY
      let nextY = currentY + currentVel
      let nextRot = currentRot

      if (!onGround) {
        nextRot = (currentRot + currentVel * 2.2) % 360
      } else {
        nextRot = 0
      }

      if (nextY + PLAYER_SIZE >= floorY) {
        nextY = floorY - PLAYER_SIZE
        currentVel = 0
        nextRot = 0
      }

      const playerNext = { x: PLAYER_X, y: nextY, width: PLAYER_SIZE, height: PLAYER_SIZE }

      for (const item of currentItems) {
        if (item.type !== 'platform') continue
        const wasAbove = currentY + PLAYER_SIZE <= item.y + 14
        const falling = currentVel >= 0
        const overlapsX = PLAYER_X + PLAYER_SIZE - 6 > item.x && PLAYER_X + 6 < item.x + item.width
        if (
          falling &&
          wasAbove &&
          overlapsX &&
          playerNext.y + PLAYER_SIZE >= item.y &&
          playerNext.y + PLAYER_SIZE <= item.y + item.height + 28
        ) {
          nextY = item.y - PLAYER_SIZE
          currentVel = 0
          nextRot = 0
          break
        }
      }

      for (const item of currentItems) {
        if (item.type !== 'block') continue
        const blockBox = { x: item.x, y: item.y, width: item.width, height: item.height }
        const playerNextBox = { x: PLAYER_X, y: nextY, width: PLAYER_SIZE, height: PLAYER_SIZE }
        if (rectsIntersect(playerNextBox, blockBox)) {
          nextY = item.y - PLAYER_SIZE
          currentVel = 0
          nextRot = 0
          break
        }
      }

      currentItems = currentItems
        .map((item) => ({ ...item, x: item.x - SCROLL_SPEED }))
        .filter((item) => item.x + (item.width || 0) > -120)

      const rightMost = currentItems.length
        ? Math.max(...currentItems.map((i) => i.x + (i.width || 0)))
        : GAME_WIDTH

      if (rightMost < GAME_WIDTH + 280) {
        currentItems = [...currentItems, ...generateCourse(rightMost + 80, 10)]
      }

      currentDecor.stars = currentDecor.stars.map((star) => {
        let nextX = star.x - SCROLL_SPEED * 0.15
        if (nextX < -10) nextX = GAME_WIDTH + rand(0, 100)
        return { ...star, x: nextX }
      })
      currentDecor.bars = currentDecor.bars.map((bar) => {
        let nextX = bar.x - SCROLL_SPEED * 0.4
        if (nextX + bar.width < 0) {
          nextX = GAME_WIDTH + rand(20, 100)
          return { ...bar, x: nextX, y: rand(50, 200), width: rand(80, 160), height: rand(6, 14) }
        }
        return { ...bar, x: nextX }
      })
      currentDecor.columns = currentDecor.columns.map((col) => {
        let nextX = col.x - SCROLL_SPEED * 0.65
        if (nextX + col.width < 0) {
          nextX = GAME_WIDTH + rand(20, 120)
          return { ...col, x: nextX, width: rand(32, 60), height: rand(60, 130) }
        }
        return { ...col, x: nextX }
      })

      const playerBox = { x: PLAYER_X, y: nextY, width: PLAYER_SIZE, height: PLAYER_SIZE }
      let hit = false

      for (const item of currentItems) {
        if (item.type === 'spike' && rectsIntersect(playerBox, item)) hit = true
        if (item.type === 'ceilingSpike') {
          const spikeBox = { x: item.x, y: item.y, width: item.width, height: item.height }
          if (rectsIntersect(playerBox, spikeBox)) hit = true
        }
        if (item.type === 'block') {
          if (item.hasSpike) {
            const spikeTop = {
              x: item.x + 2,
              y: item.y - 2,
              width: item.width - 4,
              height: 14,
            }
            if (rectsIntersect(playerBox, spikeTop)) hit = true
          }
        }
      }

      const newDistance = totalDistanceRef.current + SCROLL_SPEED
      totalDistanceRef.current = newDistance
      playerYRef.current = nextY
      velocityYRef.current = currentVel
      rotationRef.current = nextRot
      itemsRef.current = currentItems
      decorRef.current = currentDecor

      setPlayerY(nextY)
      setVelocityY(currentVel)
      setRotation(nextRot)
      setItems(currentItems)
      setDecor(currentDecor)
      setScore((s) => s + 1)
      setTotalDistance(newDistance)

      if (hit) {
        setIsGameOver(true)
        isGameOverRef.current = true
        const particles = createDeathParticles(PLAYER_X, nextY)
        deathParticlesRef.current = particles
        setDeathParticles(particles)
        setShake(24)
      }

      animationRef.current = requestAnimationFrame(tick)
    }
    animationRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const progress = Math.min(100, Math.floor((totalDistance / 5000) * 100))

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: COLORS.bg,
        padding: 24,
      }}
    >
      <div>
        <div
          style={{
            marginBottom: 12,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: '"Syne", sans-serif',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 14,
          }}
        >
          <span>Score: {score}</span>
          <span style={{ color: 'rgba(0,212,255,0.9)' }}>{progress}%</span>
          <span style={{ opacity: 0.8 }}>Space / Click • R restart</span>
        </div>

        <div
          onMouseDown={() => { jumpQueuedRef.current = true }}
          onTouchStart={() => { jumpQueuedRef.current = true }}
          style={{
            position: 'relative',
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            overflow: 'hidden',
            borderRadius: 16,
            border: '2px solid rgba(0,212,255,0.2)',
            background: COLORS.bg,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transform: `translate(${shake * (Math.random() - 0.5)}px, ${shake * (Math.random() - 0.5)}px)`,
            transition: 'transform 0.05s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

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
                background: 'rgba(255,255,255,0.9)',
                boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,${star.opacity || 0.5})`,
                opacity: star.opacity,
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
                background: 'rgba(0,212,255,0.04)',
                border: '1px solid rgba(0,212,255,0.08)',
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
                borderRadius: '8px 8px 0 0',
                background: 'linear-gradient(180deg, rgba(0,212,255,0.06), rgba(0,212,255,0.02))',
                border: '1px solid rgba(0,212,255,0.06)',
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
              background: COLORS.floor,
              borderTop: `3px solid ${COLORS.floorLine}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -(Math.floor(totalDistance / 4) % 40),
              bottom: FLOOR_HEIGHT - 8,
              width: GAME_WIDTH + 80,
              height: 12,
              background: `repeating-linear-gradient(90deg, ${COLORS.gridLight} 0 20px, ${COLORS.gridDark} 20px 40px)`,
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: PLAYER_X,
              top: playerY,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              background: isGameOver ? '#ff3366' : COLORS.cube,
              borderRadius: 6,
              boxShadow: isGameOver ? '0 0 24px rgba(255,51,102,0.6)' : '0 0 24px rgba(0,212,255,0.45)',
              border: '2px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!isGameOver && (
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: COLORS.cubeFace,
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8)',
                }}
              />
            )}
          </div>

          {deathParticles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: p.x - p.size / 2,
                top: p.y - p.size / 2,
                width: p.size,
                height: p.size,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #ff3366, #ff6699)',
                opacity: p.life,
                transform: `rotate(${p.life * 360}deg)`,
              }}
            />
          ))}

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
                    background: COLORS.platform,
                    borderRadius: 6,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              )
            }
            if (item.type === 'block') {
              return (
                <div key={item.id} style={{ position: 'absolute', left: item.x, top: item.y, width: item.width, height: item.height }}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: COLORS.block,
                      borderRadius: 4,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  />
                  {item.hasSpike && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: -14,
                        width: 0,
                        height: 0,
                        borderLeft: `${item.width / 2}px solid transparent`,
                        borderRight: `${item.width / 2}px solid transparent`,
                        borderBottom: `14px solid #ff3366`,
                        filter: `drop-shadow(0 0 6px ${COLORS.spikeGlow})`,
                      }}
                    />
                  )}
                </div>
              )
            }
            if (item.type === 'ceilingSpike') {
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
                    borderTop: `${item.height}px solid #ff3366`,
                    filter: `drop-shadow(0 0 8px ${COLORS.spikeGlow})`,
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
                  borderBottom: `${item.height}px solid #ff3366`,
                  filter: `drop-shadow(0 0 10px ${COLORS.spikeGlow})`,
                }}
              />
            )
          })}

          {isGameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: '"Syne", sans-serif',
              }}
            >
              <h2 style={{ fontSize: 36, marginBottom: 8, color: '#ff3366', textShadow: '0 0 20px rgba(255,51,102,0.6)' }}>
                Game Over
              </h2>
              <p style={{ marginBottom: 20, opacity: 0.9 }}>Score: {score} — {progress}%</p>
              <p style={{ marginBottom: 16, fontSize: 14, opacity: 0.8 }}>Press R or click Restart</p>
              <button
                onClick={resetGame}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(180deg, #00d4ff, #0099cc)',
                  color: '#0a0a12',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: '"Syne", sans-serif',
                  boxShadow: '0 0 24px rgba(0,212,255,0.5)',
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
