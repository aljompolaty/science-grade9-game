import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'
import GameShell, { WinBanner } from './GameShell.jsx'

// اختر بطاقة ثم اختر الخانة المناسبة لها
export default function Classify({ g, onDone }) {
  const items = useMemo(() => g.items.map((it, i) => ({ ...it, id: i })).sort(() => Math.random() - 0.5), [g.items])
  const [placed, setPlaced] = useState({})
  const [sel, setSel] = useState(null)
  const [shake, setShake] = useState(null)
  const [mistakes, setMistakes] = useState(0)

  const left = items.filter((it) => placed[it.id] === undefined)
  const finished = left.length === 0

  const drop = (binId) => {
    if (sel === null) return
    const it = items.find((x) => x.id === sel)
    if (it.bin === binId) {
      sfx.correct()
      const next = { ...placed, [sel]: binId }
      setPlaced(next)
      setSel(null)
      if (Object.keys(next).length === items.length) {
        setTimeout(() => {
          sfx.win()
          onDone({ perfect: mistakes === 0, mistakes })
        }, 350)
      }
    } else {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShake(binId)
      setTimeout(() => setShake(null), 450)
    }
  }

  return (
    <GameShell
      icon="Shapes"
      title={g.title}
      intro={g.intro}
      right={
        <span className="chip">
          {toAr(items.length - left.length)} / {toAr(items.length)}
        </span>
      }
    >
      <div className="bins" style={{ marginTop: 10 }}>
        {g.bins.map((b) => (
          <motion.button
            key={b.id}
            className={`bin ${sel !== null ? 'ready' : ''}`}
            onClick={() => drop(b.id)}
            animate={shake === b.id ? { x: [0, -8, 8, -5, 5, 0], borderColor: '#E2482D' } : {}}
          >
            <Icon name={b.icon} size={24} />
            {b.label}
            <span className="count">{toAr(Object.values(placed).filter((v) => v === b.id).length)}</span>
          </motion.button>
        ))}
      </div>

      <div className="cards-pool">
        <AnimatePresence>
          {left.map((it) => (
            <motion.button
              layout
              key={it.id}
              className={`item-card ${sel === it.id ? 'sel' : ''}`}
              onClick={() => {
                sfx.tap()
                setSel(it.id)
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: sel === it.id ? 1.04 : 1 }}
              exit={{ opacity: 0, scale: 0.3, y: -80 }}
            >
              <div className={`thumb ${it.img ? '' : 'ico'}`}>{it.img ? <img src={it.img} alt="" /> : <Icon name={it.icon} size={34} />}</div>
              {it.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {!finished && <p className="src-label center" style={{ justifyContent: 'center', width: '100%' }}>{sel === null ? 'اختر بطاقة أولاً' : 'الآن اختر الخانة المناسبة في الأعلى'}</p>}
      {finished && <WinBanner text={mistakes === 0 ? 'تصنيف مثالي دون أي خطأ!' : `أحسنت! أنهيت التصنيف. عدد المحاولات الخاطئة: ${toAr(mistakes)}`} />}
    </GameShell>
  )
}
