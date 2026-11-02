import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'
import GameShell, { WinBanner } from './GameShell.jsx'

// كل شاهد يضيف وصفاً، وكل وصف يضيف جزءاً إلى الرسم
const CLUES = [
  { id: 'face', who: 'الشاهد الأول', text: 'وجهه بيضاوي الشكل.' },
  { id: 'hair', who: 'الشاهد الثاني', text: 'شعره قصير وكثيف.' },
  { id: 'eyes', who: 'الشاهد الثالث', text: 'عيناه واسعتان ويرتدي نظارة دائرية.' },
  { id: 'mouth', who: 'الشاهد الرابع', text: 'كان يبتسم ابتسامة عريضة.' },
  { id: 'mark', who: 'الشاهد الخامس', text: 'لديه شامة صغيرة على خده الأيسر وأذنان بارزتان.' },
]

const ink = { stroke: '#1B1813', strokeWidth: 3, fill: 'none', strokeLinecap: 'round' }
const draw = { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.9 } }

function Drawing({ has }) {
  return (
    <svg viewBox="0 0 200 220">
      {/* بدون أوصاف: خطوط تخطيط عامة فقط */}
      {!has.face && <ellipse cx="100" cy="115" rx="62" ry="78" stroke="#B9B0A0" strokeDasharray="6 8" strokeWidth="2" fill="none" />}
      {has.face && <motion.ellipse cx="100" cy="118" rx="58" ry="74" {...ink} {...draw} />}
      {has.hair && <motion.path d="M44 100 Q48 40 100 38 Q152 40 156 100 Q140 70 100 66 Q62 70 44 100Z" fill="#1B1813" stroke="#1B1813" {...draw} />}
      {has.eyes && (
        <motion.g {...draw}>
          <circle cx="78" cy="112" r="14" {...ink} />
          <circle cx="122" cy="112" r="14" {...ink} />
          <path d="M92 112 H108" {...ink} />
          <circle cx="78" cy="112" r="4" fill="#1B1813" />
          <circle cx="122" cy="112" r="4" fill="#1B1813" />
        </motion.g>
      )}
      {(has.eyes || has.face) && <motion.path d="M100 120 Q96 138 104 142" {...ink} {...draw} />}
      {has.mouth && <motion.path d="M72 158 Q100 186 128 158" {...ink} {...draw} />}
      {has.mark && (
        <motion.g {...draw}>
          <circle cx="132" cy="146" r="3.5" fill="#1B1813" />
          <path d="M42 104 Q24 118 42 138" {...ink} />
          <path d="M158 104 Q176 118 158 138" {...ink} />
        </motion.g>
      )}
    </svg>
  )
}

export default function Sketch({ g, onDone }) {
  const [has, setHas] = useState({})
  const n = Object.keys(has).length
  const acc = Math.round((n / CLUES.length) * 100)

  const add = (c) => {
    if (has[c.id]) return
    sfx.next()
    const next = { ...has, [c.id]: true }
    setHas(next)
    if (Object.keys(next).length === CLUES.length) {
      setTimeout(() => {
        sfx.win()
        onDone({ perfect: true })
      }, 900)
    }
  }

  return (
    <GameShell icon="PenTool" title={g.title} intro={g.intro}>
      <div className="sketch-wrap">
        <Drawing has={has} />
      </div>
      <div className="row" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
        دقة النموذج <span className="spacer" /> {toAr(acc)}٪
      </div>
      <div className="progress" style={{ margin: '6px 0 14px' }}>
        <div style={{ width: `${acc}%` }} />
      </div>
      {CLUES.map((c) => (
        <button key={c.id} className={`witness ${has[c.id] ? 'used' : ''}`} onClick={() => add(c)}>
          <span className="av">
            <Icon name={has[c.id] ? 'Check' : 'MessageCircle'} size={18} />
          </span>
          <span>
            <b>{c.who}:</b> {has[c.id] ? c.text : 'اضغط لسماع وصفه'}
          </span>
        </button>
      ))}
      <AnimatePresence>
        {n === CLUES.length && <WinBanner text="كلما زادت المعلومات التي يجمعها العالم، كلما كان النموذج أكثر دقة. (من الكتاب)" />}
      </AnimatePresence>
    </GameShell>
  )
}
