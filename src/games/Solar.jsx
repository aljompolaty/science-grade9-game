import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'
import GameShell, { WinBanner } from './GameShell.jsx'

// الملاحظات الجديدة كما وردت في الكتاب، تُضاف بالترتيب لتطوير النموذج
const STEPS = [
  { text: 'من خلال المزيد من الملاحظات تم اكتشاف أن الشمس مركز النظام الشمسي', icon: 'Telescope' },
  { text: 'الأرض والكواكب الأخرى تدور حول الشمس', icon: 'Orbit' },
  { text: 'الكواكب الأخرى لديها أيضاً أقمار تدور حولها', icon: 'Sparkles' },
]

const BODIES = [
  { id: 'mercury', r: 5, orbit: 50, speed: 1.6, color: '#B9B0A0' },
  { id: 'venus', r: 7, orbit: 72, speed: 1.2, color: '#F4A6BD' },
  { id: 'earth', r: 8, orbit: 96, speed: 1, color: '#5C8BE8' },
  { id: 'mars', r: 6, orbit: 120, speed: 0.8, color: '#E2482D', moons: 1 },
  { id: 'jupiter', r: 12, orbit: 148, speed: 0.5, color: '#E8A35C', moons: 2 },
]

// ألوان الطباشير على السبورة
const CHALK = '#F3EEE3'
const SUN = '#F5C431'

function useTime() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      setT((now - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return t
}

function Model({ step, t }) {
  const sunCenter = step >= 1
  const C = 170
  const pos = (orbit, speed, phase = 0) => [C + orbit * Math.cos(t * speed * 0.6 + phase), C + orbit * Math.sin(t * speed * 0.6 + phase)]

  // النموذج القديم: الأرض في المركز وكل شيء يدور حولها
  const oldBodies = [{ id: 'sun', r: 14, orbit: 110, speed: 0.7, color: SUN }, ...BODIES.filter((b) => b.id !== 'earth')].map((b, i) => ({
    ...b,
    orbit: 46 + i * 24,
  }))

  const Sun = ({ x, y, r }) => (
    <g>
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k / 8) * Math.PI * 2 + t * 0.4
        return <line key={k} x1={x + Math.cos(a) * (r + 4)} y1={y + Math.sin(a) * (r + 4)} x2={x + Math.cos(a) * (r + 10)} y2={y + Math.sin(a) * (r + 10)} stroke={SUN} strokeWidth="2.5" strokeLinecap="round" />
      })}
      <circle cx={x} cy={y} r={r} fill={SUN} stroke={CHALK} strokeWidth="2" />
    </g>
  )

  return (
    <svg viewBox="0 0 340 362" className="solar" style={{ fontFamily: 'var(--font-hand)' }}>
      {!sunCenter && <circle cx={C} cy={C} r="164" fill="none" stroke={CHALK} strokeOpacity="0.55" strokeWidth="2" strokeDasharray="3 7" />}
      {!sunCenter && (
        <text x={C} y="20" textAnchor="middle" fill={CHALK} fontSize="13">
          السماء غطاء يغطي الكواكب
        </text>
      )}

      {(sunCenter ? BODIES : oldBodies).map((b) => (
        <circle key={'o' + b.id} cx={C} cy={C} r={b.orbit} fill="none" stroke={CHALK} strokeOpacity="0.28" strokeWidth="1.5" strokeDasharray="2 5" />
      ))}

      {/* المركز */}
      {sunCenter ? (
        <motion.g key="sunc" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: `${C}px`, originY: `${C}px` }}>
          <Sun x={C} y={C} r={20} />
        </motion.g>
      ) : (
        <circle cx={C} cy={C} r="13" fill="#5C8BE8" stroke={CHALK} strokeWidth="2" />
      )}

      {(sunCenter ? BODIES : oldBodies).map((b, i) => {
        const [x, y] = pos(b.orbit, b.speed, i * 1.3)
        if (b.id === 'sun') return <Sun key="sun" x={x} y={y} r={b.r} />
        return (
          <g key={b.id}>
            <circle cx={x} cy={y} r={b.r} fill={b.color} stroke={CHALK} strokeWidth="1.5" />
            {step >= 2 &&
              b.moons &&
              Array.from({ length: b.moons }, (_, k) => {
                const mr = b.r + 7 + k * 5
                const mx = x + mr * Math.cos(t * 3 + k * 2)
                const my = y + mr * Math.sin(t * 3 + k * 2)
                return <circle key={k} cx={mx} cy={my} r="2.6" fill={CHALK} />
              })}
          </g>
        )
      })}
      <text x={C} y="354" textAnchor="middle" fill={CHALK} fontSize="15">
        {sunCenter ? 'الشمس في المركز' : 'الأرض في المركز'}
      </text>
    </svg>
  )
}

export default function Solar({ g, onDone }) {
  const t = useTime()
  const [step, setStep] = useState(0) // عدد الملاحظات المضافة
  const [view, setView] = useState(null) // للمقارنة بعد الانتهاء
  const finished = step === STEPS.length
  // مرحلة الرسم: ٠ قديم، ١ الشمس في المركز، ٢ مع الأقمار
  const shown = view === null ? (step >= 3 ? 2 : step >= 1 ? 1 : 0) : view

  const add = () => {
    sfx.next()
    const n = step + 1
    setStep(n)
    if (n === STEPS.length) {
      setTimeout(() => {
        sfx.win()
        onDone({ perfect: true })
      }, 600)
    }
  }

  return (
    <GameShell icon="Orbit" title={g.title} intro={g.intro}>
      {finished && (
        <div className="toggle">
          <button className={shown === 0 ? 'on' : ''} onClick={() => setView(0)}>
            النموذج القديم
          </button>
          <button className={shown !== 0 ? 'on' : ''} onClick={() => setView(2)}>
            النموذج الجديد
          </button>
        </div>
      )}
      <div className="board">
        <Model step={shown} t={t} />
      </div>

      <div className="notes">
        <AnimatePresence>
          {STEPS.slice(0, step).map((s) => (
            <motion.div key={s.text} className="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Icon name={s.icon} size={18} /> {s.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!finished ? (
        <button className="btn btn-primary btn-block" onClick={add}>
          <Icon name="Telescope" /> أضف ملاحظة جديدة ({toAr(step + 1)} من {toAr(STEPS.length)})
        </button>
      ) : (
        <WinBanner text="طور العلماء نموذجاً جديداً للنظام الشمسي. يمكن تغيير النماذج بمرور الوقت عند توفر معلومات جديدة." />
      )}
    </GameShell>
  )
}
