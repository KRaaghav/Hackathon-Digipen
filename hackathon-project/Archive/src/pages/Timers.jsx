import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Timer, Plus, Trash2, Play, Pause, RotateCcw, Clock, Minimize2 } from 'lucide-react'
import { initCalmSounds, calmTimerStart, calmTimerPause, calmTimerComplete, calmTimerMinimize } from '../utils/calmSounds'
import { useLanguage } from '../contexts/LanguageContext'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

function CountdownTimer({ id, initialMinutes, label, onRemove, onStart, onStateReport, onPause, onComplete }) {
  const { t } = useLanguage()
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60)
  const [running, setRunning] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    if (onStateReport) onStateReport(id, { running, value: secondsLeft })
  }, [id, running, secondsLeft, onStateReport])

  useEffect(() => {
    if (secondsLeft === 0 && !completedRef.current) {
      completedRef.current = true
      onComplete?.(id)
    }
  }, [secondsLeft, id, onComplete])

  const reset = () => {
    setRunning(false)
    setSecondsLeft(initialMinutes * 60)
    completedRef.current = false
  }

  const handleStartPause = () => {
    const nextRunning = !running
    if (nextRunning) {
      initCalmSounds()
      calmTimerStart()
      onStart?.(id)
    } else {
      calmTimerPause()
      onPause?.(id)
    }
    setRunning(nextRunning)
  }

  const isDone = secondsLeft === 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card"
      style={{
        padding: '1.5rem',
        border: `1px solid ${isDone ? 'var(--accent3)' : 'var(--border)'}`,
        background: isDone ? 'rgba(106, 247, 200, 0.08)' : 'var(--bg2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>
          {label || `${initialMinutes} min`}
        </span>
        <button
          onClick={() => onRemove(id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 4,
          }}
          aria-label="Remove timer"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          fontWeight: 800,
          color: isDone ? 'var(--accent3)' : 'var(--accent)',
          marginBottom: '1rem',
          letterSpacing: '0.02em',
        }}
      >
        {formatTime(secondsLeft)}
      </div>
      {isDone && (
        <p style={{ fontSize: '0.9rem', color: 'var(--accent3)', marginBottom: '0.75rem' }}>Done!</p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartPause}
          disabled={isDone}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            border: 'none',
            background: running ? 'var(--accent2)' : 'var(--accent)',
            color: '#0a0a0a', fontWeight: 600, cursor: isDone ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontSize: '0.875rem',
          }}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? t('timers.pause') : t('timers.start')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: '0.875rem',
          }}
        >
          <RotateCcw size={16} />
          Reset
        </motion.button>
      </div>
    </motion.div>
  )
}

function Stopwatch({ id, onRemove, onStart, onStateReport }) {
  const { t } = useLanguage()
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [running])

  useEffect(() => {
    if (onStateReport) onStateReport(id, { running, value: seconds })
  }, [id, running, seconds, onStateReport])

  const reset = () => {
    setRunning(false)
    setSeconds(0)
  }

  const handleStartPause = () => {
    const nextRunning = !running
    if (nextRunning) {
      initCalmSounds()
      calmTimerStart()
      onStart?.(id)
    } else {
      calmTimerPause()
    }
    setRunning(nextRunning)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card"
      style={{ padding: '1.5rem', border: '1px solid var(--border)', background: 'var(--bg2)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>{t('timers.stopwatch')}</span>
        <button
          onClick={() => onRemove(id)}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4,
          }}
          aria-label="Remove"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--accent2)',
          marginBottom: '1rem',
          letterSpacing: '0.02em',
        }}
      >
        {formatTime(seconds)}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartPause}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, border: 'none',
            background: running ? 'var(--accent2)' : 'var(--accent)',
            color: '#0a0a0a', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: '0.875rem',
          }}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? t('timers.pause') : t('timers.start')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: '0.875rem',
          }}
        >
          <RotateCcw size={16} />
          Reset
        </motion.button>
      </div>
    </motion.div>
  )
}

function FullscreenOverlay({ activeTimerId, activeTimerState, onMinimize }) {
  const { t } = useLanguage()
  const show = Boolean(activeTimerId && activeTimerState)
  const { label, type, value, running } = activeTimerState || {}
  const isDone = type === 'countdown' && value === 0
  const displayLabel = type === 'stopwatch' ? t('timers.stopwatch') : (label || t('timers.timer'))

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
              }}
            >
              {displayLabel}
            </p>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 18vw, 8rem)',
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '0.02em',
                color: isDone ? 'var(--accent3)' : type === 'stopwatch' ? 'var(--accent2)' : 'var(--accent)',
                textShadow: isDone
                  ? '0 0 60px rgba(106, 247, 200, 0.4)'
                  : '0 0 80px rgba(124, 106, 247, 0.35)',
                marginBottom: '0.5rem',
              }}
            >
              {formatTime(value ?? 0)}
            </div>
            {isDone && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '1.25rem', color: 'var(--accent3)', fontWeight: 600, marginBottom: '1.5rem' }}
              >
                {t('timers.done')}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onMinimize}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
              }}
            >
              <Minimize2 size={18} />
              Minimize
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

const PRESETS = [5, 10, 15, 25, 30, 45, 60]

export default function Timers() {
  const { t } = useLanguage()
  const [timers, setTimers] = useState(() => {
    try {
      const saved = localStorage.getItem('tranquility_timers')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [activeTimerId, setActiveTimerId] = useState(null)
  const [activeTimerState, setActiveTimerState] = useState(null)

  useEffect(() => {
    localStorage.setItem('tranquility_timers', JSON.stringify(timers))
  }, [timers])

  const addCountdown = useCallback((minutes) => {
    setTimers((prev) => [
      ...prev,
      { id: Date.now(), type: 'countdown', initialMinutes: minutes, label: `${minutes} min` },
    ])
  }, [])

  const addStopwatch = useCallback(() => {
    setTimers((prev) => [...prev, { id: Date.now(), type: 'stopwatch' }])
  }, [])

  const removeTimer = useCallback((id) => {
    setTimers((prev) => prev.filter((t) => t.id !== id))
    if (activeTimerId === id) {
      setActiveTimerId(null)
      setActiveTimerState(null)
    }
  }, [activeTimerId])

  const handleTimerComplete = useCallback((id) => {
    initCalmSounds()
    calmTimerComplete()
  }, [])

  const handleTimerStart = useCallback((id) => {
    const t = timers.find((x) => x.id === id)
    if (!t) return
    setActiveTimerId(id)
    setActiveTimerState({
      label: t.label,
      type: t.type,
      value: t.type === 'countdown' ? t.initialMinutes * 60 : 0,
      running: true,
    })
  }, [timers])

  const handleStateReport = useCallback((id, { running, value }) => {
    if (id !== activeTimerId) return
    const t = timers.find((x) => x.id === id)
    setActiveTimerState((prev) => (prev ? { ...prev, running, value } : null))
  }, [activeTimerId, timers])

  const minimizeOverlay = useCallback(() => {
    initCalmSounds()
    calmTimerMinimize()
    setActiveTimerId(null)
    setActiveTimerState(null)
  }, [])

  return (
    <div className="page-container" style={{ padding: '2rem 1.5rem', maxWidth: 900 }}>
      <FullscreenOverlay
        activeTimerId={activeTimerId}
        activeTimerState={activeTimerState}
        onMinimize={minimizeOverlay}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
          <Timer size={28} color="var(--accent)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--text)' }}>
            {t('timers.timers')}
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          {t('timers.description')}
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            {t('timers.addCountdown')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {PRESETS.map((min) => (
              <motion.button
                key={min}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addCountdown(min)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg2)',
                  color: 'var(--text)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.875rem',
                }}
              >
                <Clock size={14} />
                {min} min
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addStopwatch}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginTop: '1rem',
              padding: '10px 18px', borderRadius: 10,
              border: '1px dashed var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
            }}
          >
            <Plus size={18} />
            {t('timers.addStopwatch')}
          </motion.button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {timers.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg2)',
              }}
            >
              <Timer size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p>{t('timers.noTimersYet')}</p>
            </div>
          ) : (
            timers.map((t) =>
              t.type === 'countdown' ? (
                <CountdownTimer
                  key={t.id}
                  id={t.id}
                  initialMinutes={t.initialMinutes}
                  label={t.label}
                  onRemove={removeTimer}
                  onStart={handleTimerStart}
                  onStateReport={handleStateReport}
                  onPause={() => { initCalmSounds(); calmTimerPause() }}
                  onComplete={handleTimerComplete}
                />
              ) : (
                <Stopwatch
                  key={t.id}
                  id={t.id}
                  onRemove={removeTimer}
                  onStart={handleTimerStart}
                  onStateReport={handleStateReport}
                />
              )
            )
          )}
        </div>
      </motion.div>
    </div>
  )
}
