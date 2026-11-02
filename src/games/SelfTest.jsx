import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { SourceTag } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'

// اختبر نفسك: أسئلة الكتاب المفتوحة، يكتب الطالب إجابته ثم يفتح التلميح
export default function SelfTest({ b, onDone }) {
  const [answers, setAnswers] = useState({})
  const [open, setOpen] = useState({})
  const [sent, setSent] = useState({})

  const submit = (i) => {
    sfx.correct()
    const s = { ...sent, [i]: true }
    setSent(s)
    setOpen((o) => ({ ...o, [i]: true }))
    if (Object.keys(s).length === b.questions.length) onDone?.()
  }

  return (
    <article className="book">
      <SourceTag page={b.page} />
      <h3>{b.h}</h3>
      {b.questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <p className="q" style={{ marginBottom: 6 }}>
            {q.q}
          </p>
          <textarea
            value={answers[i] || ''}
            onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
            placeholder="اكتب إجابتك هنا..."
            
            disabled={sent[i]}
          />
          <div className="row" style={{ marginTop: 6 }}>
            {!sent[i] ? (
              <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.9rem' }} disabled={(answers[i] || '').trim().length < 5} onClick={() => submit(i)}>
                <Icon name="Check" size={18} /> سجّل إجابتي
              </button>
            ) : (
              <span className="row" style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '0.9rem' }}>
                <Icon name="Check" size={18} /> تم التسجيل
              </span>
            )}
            <button className="btn" style={{ padding: '8px 10px', fontSize: '0.9rem', color: 'var(--blue)' }} onClick={() => setOpen({ ...open, [i]: !open[i] })}>
              <Icon name="Lightbulb" size={18} /> تلميح المعلم
            </button>
          </div>
          <AnimatePresence>
            {open[i] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', background: '#eef2ff', border: '1.5px solid #c7d2fe', fontFamily: 'var(--font-hand)', borderRadius: 8, padding: '8px 12px', marginTop: 6, fontSize: '0.92rem' }}
              >
                {q.hint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </article>
  )
}
