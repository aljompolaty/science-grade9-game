import { voiceFile } from './voiceKey.js'

// صوت المعلم: تسجيلات ElevenLabs بصوت «يوسف» (سوداني) من مجلد public/voice،
// وإن لم يوجد تسجيل لجملة ما يُستخدم محرك النطق في الجهاز احتياطياً
let audio = null
let token = 0
let voice = null

function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const ar = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('ar'))
  return ar.find((v) => /maged|majed|tarik|hamed|laila|google/i.test(v.name)) || ar[0] || null
}

if ('speechSynthesis' in window) {
  voice = pickVoice()
  window.speechSynthesis.onvoiceschanged = () => {
    voice = pickVoice()
  }
}

function speakDevice(text, { onStart, onEnd }) {
  voice = voice || pickVoice()
  if (!voice) {
    onEnd?.()
    return
  }
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice
  u.lang = voice.lang
  u.rate = 0.95
  u.onstart = () => onStart?.()
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.speechSynthesis.speak(u)
}

export function speak(text, { onStart, onEnd } = {}) {
  stopSpeaking()
  const my = ++token
  audio = new Audio(voiceFile(text))
  audio.onplay = () => my === token && onStart?.()
  audio.onended = () => my === token && onEnd?.()
  audio.onerror = () => {
    // لا يوجد تسجيل لهذه الجملة
    if (my === token) speakDevice(text, { onStart, onEnd })
  }
  audio.play().catch((e) => {
    // المتصفح يمنع التشغيل التلقائي قبل أول لمسة من المستخدم
    if (my !== token) return
    if (e.name === 'NotAllowedError') onEnd?.()
  })
}

export function stopSpeaking() {
  token++
  if (audio) {
    audio.pause()
    audio = null
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
