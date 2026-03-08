let audioCtx

export function initCalmSounds() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
}

/* -------------------------
   Bubble POP (main sound)
------------------------- */

export function calmPop() {
  if (!audioCtx) return

  const t = audioCtx.currentTime

  // random pitch variation so every pop feels unique
  const pitch = 800 + Math.random() * 300

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = "triangle"
  osc.frequency.setValueAtTime(pitch, t)
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.09)

  gain.gain.setValueAtTime(0.38, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(t)
  osc.stop(t + 0.1)

  // SNAP noise (gives it the real bubble rupture feel)
  const buffer = audioCtx.createBuffer(1, 256, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.7
  }

  const noise = audioCtx.createBufferSource()
  const noiseGain = audioCtx.createGain()

  noise.buffer = buffer

  noiseGain.gain.setValueAtTime(0.45, t)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)

  noise.connect(noiseGain)
  noiseGain.connect(audioCtx.destination)

  noise.start(t)
}

/* -------------------------
   Combo sound (bigger pop)
------------------------- */

export function calmCombo() {
  if (!audioCtx) return

  const t = audioCtx.currentTime

  const osc1 = audioCtx.createOscillator()
  const osc2 = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc1.type = "triangle"
  osc2.type = "sine"

  osc1.frequency.setValueAtTime(700, t)
  osc1.frequency.exponentialRampToValueAtTime(160, t + 0.15)

  osc2.frequency.setValueAtTime(1200, t)
  osc2.frequency.exponentialRampToValueAtTime(300, t + 0.15)

  gain.gain.setValueAtTime(0.45, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(audioCtx.destination)

  osc1.start(t)
  osc2.start(t)

  osc1.stop(t + 0.18)
  osc2.stop(t + 0.18)
}

/* -------------------------
   Bubble fade (missed pop)
------------------------- */

export function calmBubbleFade() {
  if (!audioCtx) return

  const t = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = "sine"

  osc.frequency.setValueAtTime(300, t)
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.2)

  gain.gain.setValueAtTime(0.15, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(t)
  osc.stop(t + 0.25)
}

/* -------------------------
   Game start sound
------------------------- */

export function calmGameStart() {
  if (!audioCtx) return

  const t = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = "sine"

  osc.frequency.setValueAtTime(300, t)
  osc.frequency.exponentialRampToValueAtTime(700, t + 0.25)

  gain.gain.setValueAtTime(0.3, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(t)
  osc.stop(t + 0.3)
}

/* -------------------------
   Game over sound
------------------------- */

export function calmGameOver() {
  if (!audioCtx) return

  const t = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = "sine"

  osc.frequency.setValueAtTime(500, t)
  osc.frequency.exponentialRampToValueAtTime(140, t + 0.5)

  gain.gain.setValueAtTime(0.25, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(t)
  osc.stop(t + 0.6)
}