import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Wind } from 'lucide-react'

const AFFIRMATIONS = [
  "You are capable of amazing things.",
  "One step at a time. You've got this.",
  "Rest is not laziness — it's fuel.",
  "Your path is uniquely yours.",
  "Breathe. You are exactly where you need to be.",
  "Progress, not perfection.",
  "Every expert was once a beginner.",
  "Your efforts are making a difference.",
  "It's okay to not have all the answers.",
  "Curiosity is your greatest superpower."
]

export default function ZenMode({ onExit }) {
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [count, setCount] = useState(4)
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0])
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)])
  }, [cycle])

  useEffect(() => {
    const phases = [
      { name: 'inhale', duration: 4 },
      { name: 'hold', duration: 4 },
      { name: 'exhale', duration: 6 }
    ]

    let phaseIdx = phases.findIndex(p => p.name === phase)
    const current = phases[phaseIdx]
    let t = current.duration

    const interval = setInterval(() => {
      t -= 1
      setCount(t)
      if (t <= 0) {
        clearInterval(interval)
        const next = (phaseIdx + 1) % phases.length
        setPhase(phases[next].name)
        setCount(phases[next].duration)
        if (next === 0) setCycle(c => c + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [phase])

  const phaseColors = {
    inhale: '#7c6af7',
    hold: '#f7a26a',
    exhale: '#6af7c8'
  }

  const phaseLabels = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        width: '100%', height: '100vh',
        background: 'radial-gradient(ellipse at center, #0d0d1a 0%, #06060d 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '3rem'
      }}
    >
      {/* Stars bg */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          borderRadius: '50%',
          background: 'white',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          opacity: Math.random() * 0.6 + 0.1,
          animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: Math.random() * 3 + 's'
        }} />
      ))}

      {/* Exit */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          width: 40, height: 40, borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease', zIndex: 10
        }}
      >
        <X size={18} />
      </button>

      {/* Zen label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
        <Wind size={16} color="var(--accent3)" />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.15em', color: 'var(--accent3)', textTransform: 'uppercase' }}>
          Zen Mode
        </span>
      </div>

      {/* Breathing circle */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer pulse rings */}
        <motion.div
          animate={{
            scale: phase === 'inhale' ? [1, 1.8] : phase === 'hold' ? 1.8 : [1.8, 1],
            opacity: [0.3, 0]
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 0 : 6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 200, height: 200, borderRadius: '50%',
            border: `1px solid ${phaseColors[phase]}`,
          }}
        />
        <motion.div
          animate={{
            scale: phase === 'inhale' ? [1, 1.5] : phase === 'hold' ? 1.5 : [1.5, 1],
            opacity: [0.4, 0]
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 0 : 6, ease: 'easeInOut', delay: 0.3 }}
          style={{
            position: 'absolute',
            width: 200, height: 200, borderRadius: '50%',
            border: `1px solid ${phaseColors[phase]}`,
          }}
        />

        {/* Main circle */}
        <motion.div
          animate={{
            scale: phase === 'inhale' ? [0.6, 1] : phase === 'hold' ? 1 : [1, 0.6],
            boxShadow: phase === 'inhale'
              ? [`0 0 20px ${phaseColors[phase]}44`, `0 0 60px ${phaseColors[phase]}88`]
              : phase === 'hold'
              ? `0 0 60px ${phaseColors[phase]}88`
              : [`0 0 60px ${phaseColors[phase]}88`, `0 0 20px ${phaseColors[phase]}44`]
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 0.1 : 6, ease: 'easeInOut' }}
          style={{
            width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${phaseColors[phase]}33 0%, ${phaseColors[phase]}11 60%, transparent 100%)`,
            border: `2px solid ${phaseColors[phase]}66`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700,
            color: phaseColors[phase], lineHeight: 1
          }}>
            {count}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em',
            color: phaseColors[phase], opacity: 0.8, textTransform: 'uppercase'
          }}>
            {phaseLabels[phase]}
          </span>
        </motion.div>
      </div>

      {/* Affirmation */}
      <motion.div
        key={cycle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          maxWidth: 400, textAlign: 'center',
          fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400,
          color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
          fontStyle: 'italic'
        }}
      >
        "{affirmation}"
      </motion.div>
    </motion.div>
  )
}