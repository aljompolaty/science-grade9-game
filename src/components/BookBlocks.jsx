import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { sfx } from '../lib/sfx.js'
import Icon from './Icon.jsx'

const toAr = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])

export function SourceTag({ page }) {
  return (
    <div className="tag">
      <span className="row" style={{ gap: 6 }}>
        <Icon name="BookOpen" size={14} /> من الكتاب
      </span>
      {page && <span>صفحة {toAr(page)}</span>}
    </div>
  )
}

// يميز الجملة المفتاحية داخل نص الكتاب دون تغيير النص
function withKey(text, key) {
  if (!key || !text.includes(key)) return text
  const [a, b] = text.split(key)
  return (
    <>
      {a}
      <mark>{key}</mark>
      {b}
    </>
  )
}

export function BookBlock({ b }) {
  return (
    <motion.article className="book" initial={{ opacity: 0, y: 20, rotateX: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}>
      <SourceTag page={b.page} />
      {b.h && <h3>{b.h}</h3>}
      {b.p?.map((t, i) => (
        <p key={i}>{withKey(t, b.key)}</p>
      ))}
      {b.items && (
        <ol>
          {b.items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      )}
      {b.q?.map((t, i) => (
        <p key={i} className="q">
          {t}
        </p>
      ))}
    </motion.article>
  )
}

export function InfoBlock({ b }) {
  return (
    <motion.article className="book info" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <SourceTag page={b.page} />
      <h3>{b.h}</h3>
      <p>{b.p}</p>
    </motion.article>
  )
}

export function FigureBlock({ b, onReady }) {
  const [seen, setSeen] = useState([])
  const [active, setActive] = useState(null)

  const tap = (i) => {
    sfx.tap()
    setActive(i)
    setSeen((s) => {
      const n = s.includes(i) ? s : [...s, i]
      if (n.length === b.hotspots.length) onReady?.()
      return n
    })
  }

  return (
    <motion.figure className="card figure" style={{ margin: 0 }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
      {b.gallery ? (
        <div className="gallery">
          {b.gallery.map((g) => (
            <div key={g.src}>
              <div className="frame">
                <img src={g.src} alt={g.caption} />
              </div>
              <small>{g.caption}</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="frame">
          <img src={b.src} alt={b.caption} />
          {b.hotspots?.map((h, i) => (
            <button
              key={i}
              className={`hotspot ${seen.includes(i) ? 'seen' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={() => tap(i)}
              aria-label={h.label}
            >
              {seen.includes(i) ? <Icon name="Check" size={18} /> : toAr(i + 1)}
            </button>
          ))}
        </div>
      )}
      <figcaption>{b.caption}</figcaption>
      {b.hotspots && (
        <>
          <AnimatePresence mode="wait">
            {active !== null ? (
              <motion.div key={active} className="card hot-label" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <img src={b.hotspots[active].img} alt="" />
                {b.hotspots[active].label}
              </motion.div>
            ) : (
              <div className="src-label center" style={{ justifyContent: 'center', width: '100%' }}>
                <Icon name="Target" size={15} /> {b.tip}
              </div>
            )}
          </AnimatePresence>
          <div className="src-label" style={{ justifyContent: 'center', width: '100%', marginTop: 6 }}>
            {toAr(seen.length)} / {toAr(b.hotspots.length)}
          </div>
        </>
      )}
    </motion.figure>
  )
}

export { toAr }
