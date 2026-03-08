/**
 * Calm, procedural sounds via Web Audio API.
 * No external files — soft tones only. Call init() after first user interaction.
 */

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(options) {
  try {
    const c = getCtx()
    const {
      freq = 440,
      type = 'sine',
      duration = 0.15,
      gain = 0.12,
      fadeOut = 0.08,
      bend
    } = options

    const now = c.currentTime
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (bend) osc.frequency.exponentialRampToValueAtTime(bend, now + duration * 0.5)
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(gain, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, now + duration)
    osc.connect(g)
    g.connect(c.destination)
    osc.start(now)
    osc.stop(now + duration)
  } catch (_) {}
}

// —— Zen Space ——
export function calmPop() {
  playTone({
    freq: 320 + Math.random() * 120,
    type: 'sine',
    duration: 0.12,
    gain: 0.1,
    bend: 180
  })
}

export function calmCombo() {
  playTone({ freq: 520, type: 'sine', duration: 0.18, gain: 0.09 })
  setTimeout(() => {
    playTone({ freq: 660, type: 'sine', duration: 0.2, gain: 0.08 })
  }, 80)
}

export function calmBubbleFade() {
  playTone({
    freq: 200,
    type: 'sine',
    duration: 0.4,
    gain: 0.04,
    bend: 120
  })
}

export function calmGameStart() {
  playTone({ freq: 400, type: 'sine', duration: 0.15, gain: 0.08 })
  setTimeout(() => playTone({ freq: 550, type: 'sine', duration: 0.2, gain: 0.07 }), 100)
  setTimeout(() => playTone({ freq: 700, type: 'sine', duration: 0.25, gain: 0.06 }), 200)
}

export function calmGameOver() {
  playTone({ freq: 380, type: 'sine', duration: 0.25, gain: 0.07, bend: 280 })
  setTimeout(() => playTone({ freq: 320, type: 'sine', duration: 0.3, gain: 0.06, bend: 200 }), 150)
}

// —— Timers ——
export function calmTimerStart() {
  playTone({ freq: 440, type: 'sine', duration: 0.1, gain: 0.07 })
}

export function calmTimerPause() {
  playTone({ freq: 360, type: 'sine', duration: 0.12, gain: 0.06 })
}

export function calmTimerComplete() {
  playTone({ freq: 528, type: 'sine', duration: 0.2, gain: 0.09 })
  setTimeout(() => playTone({ freq: 660, type: 'sine', duration: 0.25, gain: 0.07 }), 120)
  setTimeout(() => playTone({ freq: 792, type: 'sine', duration: 0.3, gain: 0.06 }), 240)
}

export function calmTimerMinimize() {
  playTone({ freq: 400, type: 'sine', duration: 0.08, gain: 0.05 })
}

// —— Zen Dash (Geometry Dash) ——
export function calmJump() {
  playTone({ freq: 280, type: 'sine', duration: 0.06, gain: 0.06, bend: 400 })
}

export function calmLand() {
  playTone({ freq: 180, type: 'sine', duration: 0.08, gain: 0.05 })
}

export function calmDeath() {
  playTone({ freq: 220, type: 'triangle', duration: 0.2, gain: 0.08, bend: 100 })
  setTimeout(() => playTone({ freq: 160, type: 'sine', duration: 0.25, gain: 0.06 }), 100)
}

/** Call once after first user click/tap so AudioContext can start */
export function initCalmSounds() {
  try {
    getCtx()
  } catch (_) {}
}
