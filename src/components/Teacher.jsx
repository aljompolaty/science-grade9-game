import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { C } from '../lib/palette.js'
import { speak, stopSpeaking } from '../lib/speech.js'
import { useProgress } from '../lib/store.jsx'
import Icon from './Icon.jsx'

const ink = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

// الروبوت «نور» — المعلم المرشد، مرسوم بالحبر بأسلوب الدفتر
export function Bot({ talking = false, mood = 'happy', size = 78 }) {
  const wow = mood === 'wow'
  return (
    <motion.svg
      viewBox="0 0 100 124"
      width={size}
      className="bot"
      animate={{ rotate: [0, -2, 0, 2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ originY: 1 }}
      aria-hidden
    >
      {/* الهوائي */}
      <path d="M50 22 V10" {...ink} />
      <motion.circle cx="50" cy="8" r="6" fill={C.red} {...ink} animate={talking ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity }} />
      {/* الأذنان */}
      <rect x="5" y="40" width="12" height="22" rx="4" fill={C.yellow} {...ink} />
      <rect x="83" y="40" width="12" height="22" rx="4" fill={C.yellow} {...ink} />
      {/* الرأس */}
      <rect x="14" y="22" width="72" height="58" rx="18" fill={C.card} {...ink} />
      <rect x="23" y="32" width="54" height="36" rx="11" fill={C.ink} />
      {/* العينان */}
      <motion.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.95, 1] }} style={{ originY: '48px' }}>
        {wow ? (
          <>
            <circle cx="39" cy="48" r="6.5" fill={C.yellow} />
            <circle cx="61" cy="48" r="6.5" fill={C.yellow} />
          </>
        ) : (
          <>
            <rect x="33" y="43" width="11" height="10" rx="3" fill={C.yellow} />
            <rect x="56" y="43" width="11" height="10" rx="3" fill={C.yellow} />
          </>
        )}
      </motion.g>
      {/* الفم */}
      {talking ? (
        <motion.rect x="43" width="14" rx="2" fill={C.pink} animate={{ height: [2, 6, 2, 5, 2], y: [59, 57, 59, 57.5, 59] }} transition={{ duration: 0.55, repeat: Infinity }} />
      ) : (
        <path d="M43 59 Q50 64 57 59" stroke={C.pink} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {/* الجسم */}
      <path d="M32 80 h36 v20 a12 12 0 0 1 -12 12 h-12 a12 12 0 0 1 -12 -12z" fill={C.teal} {...ink} />
      <rect x="42" y="88" width="16" height="12" rx="3" fill={C.card} {...ink} strokeWidth="2.5" />
      <path d="M46 94 h8" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" />
    </motion.svg>
  )
}

// المعلم يتحدث: فقاعة بخط اليد تظهر تدريجياً مع الصوت
export default function Teacher({ say, mood }) {
  const { voice } = useProgress()
  const [shown, setShown] = useState(0)
  const [talking, setTalking] = useState(false)
  const words = say.split(' ')

  useEffect(() => {
    setShown(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(i)
      if (i >= words.length) clearInterval(id)
    }, 70)
    return () => clearInterval(id)
  }, [say, words.length])

  const play = () => speak(say, { onStart: () => setTalking(true), onEnd: () => setTalking(false) })

  useEffect(() => {
    if (voice) play()
    else setTalking(false)
    return () => stopSpeaking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [say, voice])

  return (
    <motion.div className="teacher" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Bot talking={talking || shown < words.length} mood={mood} />
      <div className="bubble">
        <div className="who">
          المعلم نور
          <button onClick={play} aria-label="استمع إلى الشرح">
            <Icon name="Volume2" size={17} />
          </button>
        </div>
        {words.slice(0, shown).join(' ')}{' '}
        <span style={{ opacity: 0 }}>{words.slice(shown).join(' ')}</span>
      </div>
    </motion.div>
  )
}
