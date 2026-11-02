// مؤثرات صوتية مولدة بالكامل (لا ملفات صوتية)
let ctx = null
let enabled = true

export const setSoundEnabled = (v) => {
  enabled = v
}

function tone(freq, dur, { type = 'sine', vol = 0.12, delay = 0, slide } = {}) {
  if (!enabled) return
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    const t = ctx.currentTime + delay
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t)
    o.stop(t + dur + 0.05)
  } catch {
    // الصوت غير مدعوم
  }
}

export const sfx = {
  tap: () => tone(660, 0.06, { type: 'triangle', vol: 0.06 }),
  next: () => tone(420, 0.12, { type: 'sine', slide: 720, vol: 0.07 }),
  correct: () => {
    tone(660, 0.12, { type: 'triangle' })
    tone(990, 0.18, { type: 'triangle', delay: 0.09 })
  },
  wrong: () => tone(220, 0.25, { type: 'sawtooth', vol: 0.05, slide: 140 }),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', delay: i * 0.11 })),
  shake: () => [0, 0.08, 0.16].forEach((d) => tone(120 + Math.random() * 60, 0.07, { type: 'square', vol: 0.04, delay: d })),
  hit: () => tone(180, 0.2, { type: 'square', vol: 0.06, slide: 60 }),
}
