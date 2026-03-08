import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, RotateCcw, Trophy, Sparkles, Wind } from 'lucide-react'
import DotGrid from '../components/DotGrid'
import { initCalmSounds, calmPop, calmCombo, calmBubbleFade, calmGameStart, calmGameOver } from '../utils/calmSounds'

export default function ZenGame() {
  const [gameMode, setGameMode] = useState('menu') // menu | playing | over
  const [score, setScore] = useState(0)
  const [bubbles, setBubbles] = useState([])
  const [combo, setCombo] = useState(0)
  const [popEffects, setPopEffects] = useState([])
  const [popBursts, setPopBursts] = useState([])
  const [popParticles, setPopParticles] = useState([])
  const intervalRef = useRef(null)
  const bubbleIdRef = useRef(0)

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pf_highscore')
    return parseInt(saved || '0', 10)
  })

  const COLORS = ['#7c6af7', '#f7a26a', '#6af7c8', '#f76a6a', '#6ab8f7', '#f76af7', '#f7f76a', '#a855f7']

  const spawnBubble = useCallback(() => {
    const id = ++bubbleIdRef.current
    const size = Math.random() * 36 + 44
    const x = Math.random() * 85 + 5
    const y = Math.random() * 80 + 10
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const points = Math.round((60 / size) * 15)
    const lifetimeSec = Math.random() * 4 + 8

    setBubbles(prev => {
      if (prev.length >= 20) return prev
      return [
        ...prev,
        {
          id,
          x,
          y,
          size,
          color,
          points,
          spawnedAt: Date.now(),
          lifetimeSec,
          fading: false
        }
      ]
    })
  }, [])

  useEffect(() => {
    if (gameMode !== 'playing') return
    const t = setInterval(() => {
      const now = Date.now()
      setBubbles(prev => prev.map(b => ({
        ...b,
        fading: b.fading || (now - b.spawnedAt) / 1000 >= b.lifetimeSec
      })))
    }, 400)
    return () => clearInterval(t)
  }, [gameMode])

  useEffect(() => {
    if (gameMode === 'playing') {
      for (let i = 0; i < 8; i++) spawnBubble()
      const spawnRate = 2200
      intervalRef.current = setInterval(() => {
        spawnBubble()
      }, spawnRate)
    }

    return () => clearInterval(intervalRef.current)
  }, [gameMode, spawnBubble])

  useEffect(() => {
    if (gameMode === 'over') {
      clearInterval(intervalRef.current)

      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('pf_highscore', String(score))
      }
    }
  }, [gameMode, score, highScore])

  const removeFadedBubble = useCallback((id) => {
    calmBubbleFade()
    setBubbles(prev => prev.filter(b => b.id !== id))
    setTimeout(() => spawnBubble(), 300)
  }, [spawnBubble])

  const popBubble = (bubble, e) => {
    e.stopPropagation()
    initCalmSounds()
    if (combo + 1 >= 3) calmCombo()
    else calmPop()

    setBubbles(prev => prev.filter(b => b.id !== bubble.id))

    const newCombo = combo + 1
    setCombo(newCombo)

    const pts = bubble.points * (newCombo >= 3 ? 2 : 1)
    setScore(s => s + pts)

    const effect = {
      id: Date.now() + Math.random(),
      x: bubble.x,
      y: bubble.y,
      color: bubble.color,
      pts,
      combo: newCombo
    }

    setPopEffects(prev => [...prev, effect])
    setPopBursts(prev => [...prev, { id: effect.id, x: bubble.x, y: bubble.y, color: bubble.color }])
    setPopParticles(prev => [...prev, { id: effect.id, x: bubble.x, y: bubble.y, color: bubble.color }])

    setTimeout(() => {
      setPopEffects(prev => prev.filter(p => p.id !== effect.id))
      setPopBursts(prev => prev.filter(p => p.id !== effect.id))
      setPopParticles(prev => prev.filter(p => p.id !== effect.id))
    }, 1000)

    setTimeout(() => spawnBubble(), 400)
  }

  const startGame = () => {
    initCalmSounds()
    calmGameStart()
    clearInterval(intervalRef.current)
    setBubbles([])
    setScore(0)
    setCombo(0)
    setPopEffects([])
    setPopBursts([])
    setPopParticles([])
    bubbleIdRef.current = 0
    setGameMode('playing')
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span className="chip chip-green">
              <Gamepad2 size={10} /> Zen Space
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '0.3rem'
            }}
          >
            Zen Space 🫧
          </h1>

          <p style={{ color: 'var(--text-muted)' }}>
            Take a break. Pop some bubbles. Breathe easy.
          </p>
        </div>

        {gameMode === 'menu' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '3rem 2rem' }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>
              🫧
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem'
              }}
            >
              Bubble Pop
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                marginBottom: '2rem',
                maxWidth: 360,
                margin: '0 auto 2rem'
              }}
            >
              Tap bubbles to pop them before they fade. Feel the pop — build combos for a 2× bonus!
            </p>

            {highScore > 0 && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '100px',
                  background: 'rgba(247,162,106,0.15)',
                  border: '1px solid rgba(247,162,106,0.3)',
                  color: 'var(--accent2)',
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600
                }}
              >
                <Trophy size={16} /> Best: {highScore}
              </div>
            )}

            <br />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '14px 32px' }}
              onClick={startGame}
            >
              <Gamepad2 size={18} /> Start Playing
            </motion.button>
          </motion.div>
        )}

        {gameMode === 'over' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '3rem 2rem' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💫</div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 800,
                marginBottom: '0.5rem'
              }}
            >
              Nice one!
            </h2>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  padding: '1.5rem 2rem',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--accent)'
                  }}
                >
                  {score}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Your Score
                </div>
              </div>

              <div
                style={{
                  padding: '1.5rem 2rem',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--accent2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Trophy size={28} /> {highScore}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Best Score
                </div>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: '100px',
                  background: 'rgba(106,247,162,0.15)',
                  border: '1px solid rgba(106,247,162,0.3)',
                  color: 'var(--success)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  marginBottom: '1.5rem'
                }}
              >
                🎉 New High Score!
              </motion.div>
            )}

            <br />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="btn btn-primary"
                onClick={startGame}
              >
                <RotateCcw size={16} /> Play Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost"
                onClick={() => setGameMode('menu')}
              >
                Back to Menu
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameMode === 'playing' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {combo >= 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={combo}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '100px',
                      background: 'rgba(247,162,106,0.2)',
                      color: 'var(--accent2)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    🔥 {combo}× Combo!
                  </motion.div>
                )}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  color: 'var(--text)'
                }}
              >
                {score}
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                height: 500,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                cursor: 'crosshair',
                background: 'rgba(12, 10, 30, 0.88)'
              }}
            >
              <DotGrid
                dotSize={10}
                gap={20}
                baseColor="#2b2250"
                activeColor="#7c6af7"
                proximity={140}
                speedTrigger={80}
                shockRadius={180}
                shockStrength={3}
                maxSpeed={4000}
                resistance={700}
                returnDuration={1.2}
                style={{
                  zIndex: 0,
                  opacity: 0.8
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  background:
                    'radial-gradient(ellipse at center bottom, rgba(124,106,247,0.12) 0%, rgba(124,106,247,0.04) 35%, transparent 70%)'
                }}
              />

              <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                <AnimatePresence>
                  {bubbles.map(bubble => (
                    <motion.button
                      key={bubble.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        bubble.fading
                          ? { scale: 0.92, opacity: 0 }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={
                        bubble.fading
                          ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
                          : { type: 'spring', stiffness: 200, damping: 15 }
                      }
                      onAnimationComplete={() => {
                        if (bubble.fading) removeFadedBubble(bubble.id)
                      }}
                      exit={{
                        scale: [1, 1.4, 0],
                        opacity: [1, 1, 0],
                        transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }
                      }}
                      onClick={(e) => !bubble.fading && popBubble(bubble, e)}
                      style={{
                        position: 'absolute',
                        width: bubble.size,
                        height: bubble.size,
                        borderRadius: '50%',
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle at 35% 35%, ${bubble.color}ff, ${bubble.color}99)`,
                        border: `2px solid ${bubble.color}`,
                        boxShadow: `0 0 28px ${bubble.color}66, inset 0 0 16px rgba(255,255,255,0.28)`,
                        cursor: bubble.fading ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: bubble.size > 55 ? '1rem' : '0.7rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'white',
                        pointerEvents: bubble.fading ? 'none' : 'auto'
                      }}
                      whileHover={bubble.fading ? {} : { scale: 1.14 }}
                      whileTap={bubble.fading ? {} : { scale: 0.94 }}
                    >
                      {bubble.points}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ position: 'absolute', inset: 0, zIndex: 2.3, pointerEvents: 'none' }}>
                <AnimatePresence>
                  {popParticles.map(pop => (
                    <div key={pop.id} style={{ position: 'absolute', inset: 0 }}>
                      {Array.from({ length: 10 }).map((_, i) => {
                        const angle = (i / 10) * Math.PI * 2 + (i * 0.1)
                        const dist = 32 + (i % 3) * 8
                        return (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, scale: 0.9, opacity: 1 }}
                            animate={{
                              x: Math.cos(angle) * dist,
                              y: Math.sin(angle) * dist,
                              scale: 0,
                              opacity: 0
                            }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            style={{
                              position: 'absolute',
                              left: `${pop.x}%`,
                              top: `${pop.y}%`,
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: pop.color,
                              boxShadow: `0 0 10px ${pop.color}`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        )
                      })}
                    </div>
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ position: 'absolute', inset: 0, zIndex: 2.5, pointerEvents: 'none' }}>
                <AnimatePresence>
                  {popBursts.map(burst => (
                    <motion.div
                      key={burst.id}
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                      style={{
                        position: 'absolute',
                        left: `${burst.x}%`,
                        top: `${burst.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${burst.color}99 0%, ${burst.color}44 35%, transparent 65%)`,
                        boxShadow: `0 0 50px ${burst.color}88, 0 0 80px ${burst.color}44`
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
                <AnimatePresence>
                  {popEffects.map(effect => (
                    <motion.div
                      key={effect.id}
                      initial={{ opacity: 1, scale: 0.3 }}
                      animate={{ opacity: 0, scale: 1.4, y: -32 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.5 }}
                      style={{
                        position: 'absolute',
                        left: `${effect.x}%`,
                        top: `${effect.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: effect.combo >= 3 ? '1.6rem' : '1.1rem',
                        color: effect.color,
                        textShadow: `0 0 14px ${effect.color}, 0 0 28px ${effect.color}88`
                      }}
                    >
                      +{effect.pts}{effect.combo >= 3 ? ' 🔥' : ''}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

                {bubbles.length === 0 && (
                <div
                    style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    pointerEvents: 'none'
                    }}
                >
                    Pop to relax...
                </div>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', padding: '6px 16px' }}
                onClick={() => {
                  initCalmSounds()
                  calmGameOver()
                  clearInterval(intervalRef.current)
                  setGameMode('over')
                }}
              >
                End Game
              </motion.button>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(106,247,200,0.08), rgba(124,106,247,0.08))',
            border: '1px solid rgba(106,247,200,0.2)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              flexShrink: 0,
              background: 'rgba(106,247,200,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Wind size={20} color="var(--accent3)" />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'var(--accent3)',
                marginBottom: '4px'
              }}
            >
              REMINDER
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
              Taking breaks is scientifically proven to improve focus and reduce stress. You're not wasting time — you're
              investing in your best performance. 🌿
            </p>
          </div>

          <button
            className="btn btn-ghost"
            style={{ fontSize: '0.82rem' }}
            onClick={() => {
              const affirmations = [
                "You're doing great!",
                'Rest is productive too.',
                'One bubble at a time 🫧',
                'Progress over perfection.',
                "Breathe. You've got this."
              ]
              alert(affirmations[Math.floor(Math.random() * affirmations.length)])
            }}
          >
            <Sparkles size={14} /> Get Affirmation
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}