import { motion } from 'framer-motion'
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'

// الخلاصة: الوجه الأمامي عنوان الكتاب، والخلفي نص الخلاصة حرفياً
export default function Flashcards({ b, onDone }) {
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const [seen, setSeen] = useState(new Set())
  const c = b.cards[i]

  const turn = () => {
    sfx.next()
    setFlip((f) => !f)
    const s = new Set(seen).add(i)
    setSeen(s)
    if (s.size === b.cards.length) onDone?.()
  }
  const go = (d) => {
    sfx.tap()
    setFlip(false)
    setI((x) => (x + d + b.cards.length) % b.cards.length)
  }

  return (
    <div>
      <div className="src-label" style={{ marginBottom: 8 }}>
        <Icon name="BookOpen" size={14} /> الخلاصة — من الكتاب صفحة {toAr(b.page)}
      </div>
      <motion.button key={i} className={`flip ${flip ? 'on' : ''}`} style={{ width: '100%' }} onClick={turn} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flip-inner">
          <div className="flip-face front">
            <Icon name="Layers" size={34} />
            <h3 style={{ fontSize: '1.35rem' }}>{c.h}</h3>
            <span className="chip">
              <Icon name="RotateCcw" size={14} /> اضغط لقلب البطاقة
            </span>
          </div>
          <div className="flip-face back">
            <h3 style={{ color: 'var(--blue)' }}>{c.h}</h3>
            {c.p?.map((t, k) => (
              <div key={k}>{t}</div>
            ))}
            {c.items && (
              <ul>
                {c.items.map((t, k) => (
                  <li key={k}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.button>
      <div className="dots">
        {b.cards.map((_, k) => (
          <i key={k} className={k === i ? 'on' : seen.has(k) ? 'seen' : ''} />
        ))}
      </div>
      <div className="row">
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => go(-1)}>
          <Icon name="ArrowRight" /> السابقة
        </button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => go(1)}>
          التالية <Icon name="ArrowLeft" />
        </button>
      </div>
      <p className="src-label center" style={{ justifyContent: 'center', width: '100%' }}>
        قلبت {toAr(seen.size)} من {toAr(b.cards.length)} بطاقات
      </p>
    </div>
  )
}
