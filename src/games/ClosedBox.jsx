import { motion, useAnimationControls } from 'framer-motion'
import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'
import GameShell, { WinBanner } from './GameShell.jsx'

// ما يمكن أن يكون داخل الصندوق، وما تكشفه كل أداة عنه
const OBJECTS = {
  ball: { name: 'كرة صغيرة', icon: 'CircleDot', shake: 'صوت تدحرج ناعم', tilt: 'شيء يتدحرج بسرعة إلى الطرف', weigh: 'خفيف' },
  cube: { name: 'مكعب خشبي', icon: 'Box', shake: 'صوت ارتطام واحد قوي', tilt: 'شيء ينزلق ببطء ثم يصطدم', weigh: 'ثقيل نسبياً' },
  coins: { name: 'قطع نقدية', icon: 'Coins', shake: 'صوت رنين متعدد', tilt: 'عدة أشياء صغيرة تنزلق معاً', weigh: 'متوسط' },
}
const TOOLS = [
  { id: 'shake', label: 'هزّ الصندوق', icon: 'Vibrate', sense: 'Ear' },
  { id: 'tilt', label: 'أمِل الصندوق', icon: 'RotateCcw', sense: 'Hand' },
  { id: 'weigh', label: 'زِن الصندوق', icon: 'Scale', sense: 'Scale' },
]

export default function ClosedBox({ g, onDone }) {
  const secret = useMemo(() => Object.keys(OBJECTS)[Math.floor(Math.random() * 3)], [])
  const [notes, setNotes] = useState([])
  const [phase, setPhase] = useState('observe') // observe → model → result
  const [guess, setGuess] = useState(null)
  const [tries, setTries] = useState(0)
  const [opened, setOpened] = useState(false)
  const box = useAnimationControls()

  const use = async (t) => {
    if (t.id === 'shake') {
      sfx.shake()
      box.start({ x: [0, -14, 14, -10, 10, 0], rotate: [0, -4, 4, -2, 0], transition: { duration: 0.5 } })
    } else if (t.id === 'tilt') {
      sfx.tap()
      box.start({ rotate: [0, -18, -18, 0], transition: { duration: 1 } })
    } else {
      sfx.tap()
      box.start({ y: [0, 10, 0], transition: { duration: 0.6 } })
    }
    if (!notes.find((n) => n.id === t.id)) setNotes((n) => [...n, { id: t.id, icon: t.sense, text: OBJECTS[secret][t.id] }])
  }

  const test = (key) => {
    setGuess(key)
    setTries((x) => x + 1)
    setPhase('result')
    if (key === secret) sfx.correct()
    else sfx.wrong()
  }

  const ok = guess === secret

  return (
    <GameShell icon="Box" title={g.title} intro={g.intro}>
      <div className="box-stage">
        <motion.div className="mystery" animate={box}>
          {opened ? <Icon name={OBJECTS[secret].icon} size={56} strokeWidth={2.4} /> : '؟'}
        </motion.div>
      </div>

      {phase === 'observe' && (
        <>
          <div className="tools">
            {TOOLS.map((t) => (
              <button key={t.id} className={`tool ${notes.find((n) => n.id === t.id) ? 'used' : ''}`} onClick={() => use(t)}>
                <Icon name={t.icon} size={24} />
                {t.label}
              </button>
            ))}
          </div>
          <div className="notes">
            {notes.map((n) => (
              <motion.div key={n.id} className="note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Icon name={n.icon} size={18} /> ملاحظة: {n.text}
              </motion.div>
            ))}
          </div>
          <button className="btn btn-primary btn-block" disabled={notes.length < 3} onClick={() => setPhase('model')}>
            <Icon name="Lightbulb" /> {notes.length < 3 ? `اجمع ${toAr(3 - notes.length)} ملاحظات أخرى` : 'كوّن فرضيتك'}
          </button>
        </>
      )}

      {phase === 'model' && (
        <>
          <p style={{ margin: '4px 0 10px' }}>
            <b>فرضيتك:</b> ماذا يوجد في الصندوق؟ سنبني <b>نموذجاً</b> بالشيء الذي تختاره ونجري عليه الاختبارات نفسها.
          </p>
          <div className="options">
            {Object.entries(OBJECTS).map(([k, o]) => (
              <button key={k} className="option" onClick={() => test(k)}>
                <span className="letter"><Icon name={o.icon} size={18} /></span> نموذج فيه {o.name}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'result' && (
        <>
          <div className="card" style={{ padding: 12, margin: '6px 0 10px' }}>
            <div className="row" style={{ fontWeight: 700, marginBottom: 6 }}>
              <Icon name="FlaskConical" size={18} /> مقارنة النموذج بالصندوق الأصلي
            </div>
            {TOOLS.map((t) => {
              const same = OBJECTS[guess][t.id] === OBJECTS[secret][t.id]
              return (
                <div key={t.id} className="row" style={{ fontSize: '0.9rem', padding: '4px 0' }}>
                  <Icon name={same ? 'Check' : 'X'} size={18} color={same ? 'var(--teal)' : 'var(--red)'} />
                  <span>
                    {t.label}: النموذج «{OBJECTS[guess][t.id]}» — الأصلي «{OBJECTS[secret][t.id]}»
                  </span>
                </div>
              )
            })}
          </div>
          {ok ? (
            <>
              <WinBanner text="نموذجك يطابق كل الملاحظات، فالفرضية مدعومة! هكذا يستخدم العلماء النماذج لاختبار الفرضيات." />
              {!opened ? (
                <button
                  className="btn btn-ghost btn-block"
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setOpened(true)
                    sfx.win()
                    onDone({ perfect: tries === 1 })
                  }}
                >
                  <Icon name="Eye" /> افتح الصندوق للتأكد
                </button>
              ) : (
                <p className="center" style={{ marginTop: 10 }}>
                  بداخله فعلاً: <b>{OBJECTS[secret].name}</b>
                </p>
              )}
            </>
          ) : (
            <>
              <div className="feedback no">
                <Icon name="Lightbulb" size={20} />
                <div>نموذجك لا يطابق الملاحظات، فالفرضية غير مدعومة. هذا جزء طبيعي من العلم: عدّل فرضيتك وجرب نموذجاً آخر.</div>
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop: 10 }} onClick={() => setPhase('model')}>
                <Icon name="RotateCcw" /> جرّب فرضية أخرى
              </button>
            </>
          )}
        </>
      )}
    </GameShell>
  )
}
