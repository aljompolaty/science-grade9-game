import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { sfx } from '../lib/sfx.js'
import Icon from './Icon.jsx'

const letters = ['أ', 'ب', 'ج', 'د']

// سؤال اختيار من متعدد. shuffle للأسئلة السريعة فقط؛ أسئلة الكتاب تبقى بترتيبها الأصلي
export default function QuickCheck({ q, options, a, why, shuffle = true, label = 'سؤال سريع', onAnswer, showLetters = true }) {
  const order = useMemo(() => {
    const idx = options.map((_, i) => i)
    if (!shuffle) return idx
    return idx.sort(() => Math.random() - 0.5)
  }, [options, shuffle])
  const [picked, setPicked] = useState(null)

  const choose = (i) => {
    if (picked !== null) return
    setPicked(i)
    const ok = i === a
    if (ok) sfx.correct()
    else sfx.wrong()
    onAnswer?.(ok)
  }

  return (
    <motion.div className="card question" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="src-label" style={{ marginBottom: 6 }}>
        <Icon name="Zap" size={14} /> {label}
      </div>
      <h3>{q}</h3>
      <div className="options">
        {order.map((i, k) => {
          const state = picked === null ? '' : i === a ? 'right' : i === picked ? 'wrong' : ''
          return (
            <motion.button
              key={i}
              className={`option ${state}`}
              onClick={() => choose(i)}
              animate={state === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {showLetters && <span className="letter">{letters[k]}</span>}
              <span>{options[i]}</span>
            </motion.button>
          )
        })}
      </div>
      {picked !== null && (
        <motion.div className={`feedback ${picked === a ? 'ok' : 'no'}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Icon name={picked === a ? 'Check' : 'Lightbulb'} size={20} />
          <div>
            <b>{picked === a ? 'إجابة صحيحة! ' : 'ليست هذه. '}</b>
            {why}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
