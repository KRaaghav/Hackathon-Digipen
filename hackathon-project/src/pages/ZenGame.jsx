import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, RotateCcw, Trophy, Heart, Sparkles, Wind } from 'lucide-react'

// GAME: Bubble Pop - click rising bubbles to pop them before they float away
// Simple, satisfying, and stress-relieving

export default function ZenGame() {
  const [gameMode, setGameMode] = useState('menu') // menu | playing | over
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [bubbles, setBubbles] = useState([])
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('pf_highscore') || '0'))
  const [combo, setCombo] = useState(0)
  const [popEffects, setPopEffects] = useState([])
  const intervalRef = useRef(null)
  const bubbleIdRef = useRef(0)

  const COLORS = ['#7c6af7', '#f7a26a', '#6af7c8', '#f76a6a', '#6ab8f7', '#f76af7', '#f7f76a', '#a855f7']

  const spawnBubble = useCallback(() => {
    const id = ++bubbleIdRef.current
    const size = Math.random() * 40 + 40
    const x = Math.random() * 80 + 10 // 10%-90% of width
    const duration = Math.random() * 3 + 4 // 4-7s to float up
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const points = Math.round(60 / size * 20) // smaller = more points

    setBubbles(prev => [...prev, { id, x, size, duration, color, points, spawned: Date.now() }])

    // Remove bubble after it floats away (add a miss)
    setTimeout(() => {
      setBubbles(prev => {
        const exists = prev.find(b => b.id === id)
        if (exists) {
          setLives(l => {
            if (l <= 1) {
              setGameMode('over')
            }
            return Math.max(0, l - 1)
          })
          setCombo(0)
        }
        return prev.filter(b => b.id !== id)
      })
    }, duration * 1000 + 500)
  }, [])

  useEffect(() => {
    if (gameMode === 'playing') {
      spawnBubble()
      let spawnRate = 1800
      intervalRef.current = setInterval(() => {
        spawnBubble()
        spawnRate = Math.max(600, spawnRate - 20)
      }, spawnRate)
    }
    return () => clearInterval(intervalRef.current)
  }, [gameMode])

  useEffect(() => {
    if (gameMode === 'over') {
      clearInterval(intervalRef.current)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('pf_highscore', String(score))
      }
    }
  }, [gameMode])

  const popBubble = (bubble, e) => {
    e.stopPropagation()
    setBubbles(prev => prev.filter(b => b.id !== bubble.id))

    const newCombo = combo + 1
    setCombo(newCombo)
    const pts = bubble.points * (newCombo >= 3 ? 2 : 1)
    setScore(s => s + pts)

    // Pop effect
    const effect = { id: Date.now(), x: bubble.x, color: bubble.color, pts, combo: newCombo }
    setPopEffects(prev => [...prev, effect])
    setTimeout(() => setPopEffects(prev => prev.filter(p => p.id !== effect.id)), 800)
  }

  const startGame = () => {
    setBubbles([])
    setScore(0)
    setLives(3)
    setCombo(0)
    setPopEffects([])
    bubbleIdRef.current = 0
    setGameMode('playing')
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span className="chip chip-green"><Gamepad2 size={10} /> Zen Space</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.3rem' }}>
            Zen Space 🫧
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Take a break. Pop some bubbles. Breathe easy.</p>
        </div>

        {/* Menu */}
        {gameMode === 'menu' && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🫧</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Bubble Pop
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
              Pop the bubbles before they float away. Small bubbles score more points. Build combos for a 2× bonus!
            </p>
            {highScore > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '100px', background: 'rgba(247,162,106,0.15)', border: '1px solid rgba(247,162,106,0.3)', color: 'var(--accent2)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                <Trophy size={16} /> Best: {highScore}
              </div>
            )}
            <br />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }} onClick={startGame}>
              <Gamepad2 size={18} /> Start Playing
            </motion.button>
          </motion.div>
        )}

        {/* Game over */}
        {gameMode === 'over' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💫</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Nice one!
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '1.5rem 2rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>{score}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Your Score</div>
              </div>
              <div style={{ padding: '1.5rem 2rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={28} /> {highScore}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Best Score</div>
              </div>
            </div>
            {score >= highScore && score > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
                style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '100px', background: 'rgba(106,247,162,0.15)', border: '1px solid rgba(106,247,162,0.3)', color: 'var(--success)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1.5rem' }}>
                🎉 New High Score!
              </motion.div>
            )}
            <br />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={startGame}>
                <RotateCcw size={16} /> Play Again
              </motion.button>
              <button className="btn btn-ghost" onClick={() => setGameMode('menu')}>Back to Menu</button>
            </div>
          </motion.div>
        )}

        {/* Playing */}
        {gameMode === 'playing' && (
          <div>
            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart key={i} size={20} fill={i < lives ? 'var(--danger)' : 'transparent'} color={i < lives ? 'var(--danger)' : 'var(--border)'} />
                  ))}
                </div>
                {combo >= 3 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={combo}
                    style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(247,162,106,0.2)', color: 'var(--accent2)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>
                    🔥 {combo}× Combo!
                  </motion.div>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text)' }}>
                {score}
              </div>
            </div>

            {/* Game area */}
            <div style={{
              position: 'relative', height: 500, overflow: 'hidden',
              background: 'radial-gradient(ellipse at center bottom, rgba(124,106,247,0.08) 0%, transparent 70%)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              cursor: 'crosshair'
            }}>
              {/* Background grid pattern */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />

              {/* Bubbles */}
              <AnimatePresence>
                {bubbles.map(bubble => (
                  <motion.button
                    key={bubble.id}
                    initial={{ y: '110%', x: `${bubble.x}%`, scale: 0 }}
                    animate={{ y: '-10%', scale: 1, x: `${bubble.x + Math.sin(bubble.id) * 5}%` }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: bubble.duration, ease: 'linear', scale: { duration: 0.3 } }}
                    onClick={(e) => popBubble(bubble, e)}
                    style={{
                      position: 'absolute',
                      width: bubble.size, height: bubble.size,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 35%, ${bubble.color}ff, ${bubble.color}88)`,
                      border: `2px solid ${bubble.color}`,
                      boxShadow: `0 0 20px ${bubble.color}44, inset 0 0 10px rgba(255,255,255,0.2)`,
                      cursor: 'pointer',
                      transform: 'translate(-50%, -50%)',
                      left: 0, top: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: bubble.size > 60 ? '1rem' : '0.75rem',
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      color: 'white'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    {bubble.points}
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* Pop effects */}
              <AnimatePresence>
                {popEffects.map(effect => (
                  <motion.div key={effect.id}
                    initial={{ opacity: 1, scale: 0.5, x: `${effect.x}%`, y: '50%' }}
                    animate={{ opacity: 0, scale: 1.5, y: '30%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      position: 'absolute', left: 0, top: 0,
                      transform: 'translate(-50%, -50%)',
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: effect.combo >= 3 ? '1.5rem' : '1rem',
                      color: effect.color, pointerEvents: 'none',
                      textShadow: `0 0 10px ${effect.color}`
                    }}
                  >
                    +{effect.pts}{effect.combo >= 3 ? ' 🔥' : ''}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Instruction hint */}
              {bubbles.length === 0 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                  Bubbles incoming...
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 16px' }} onClick={() => { clearInterval(intervalRef.current); setGameMode('over') }}>
                End Game
              </button>
            </div>
          </div>
        )}

        {/* Affirmation section below game */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '2rem', padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(106,247,200,0.08), rgba(124,106,247,0.08))',
            border: '1px solid rgba(106,247,200,0.2)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
            background: 'rgba(106,247,200,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Wind size={20} color="var(--accent3)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent3)', marginBottom: '4px' }}>
              REMINDER
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
              Taking breaks is scientifically proven to improve focus and reduce stress. You're not wasting time — you're investing in your best performance. 🌿
            </p>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: '0.82rem' }}
            onClick={() => {
              const affirmations = ["You're doing great!", "Rest is productive too.", "One bubble at a time 🫧", "Progress over perfection.", "Breathe. You've got this."]
              alert(affirmations[Math.floor(Math.random() * affirmations.length)])
            }}>
            <Sparkles size={14} /> Get Affirmation
          </button>
        </motion.div>

      </motion.div>
    </div>
  )
}