import confetti from 'canvas-confetti'
import { motion, useAnimationControls } from 'framer-motion'
import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import QuickCheck from '../components/QuickCheck.jsx'
import { SourceTag, toAr } from '../components/BookBlocks.jsx'
import TopBar from '../components/TopBar.jsx'
import { units } from '../data/units.js'
import { C } from '../lib/palette.js'
import { useProgress } from '../lib/store.jsx'
import { sfx } from '../lib/sfx.js'

const LIVES = 3

function Monster({ hp, controls }) {
  return (
    <motion.svg viewBox="0 0 160 140" width="150" animate={controls} aria-hidden>
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
        {/* حلقة كوكبية خلف الجسم */}
        <path d="M8 92 Q80 52 152 70" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round" transform="rotate(-6 80 74)" />
        <path d="M8 92 Q80 52 152 70" fill="none" stroke={C.yellow} strokeWidth="4.5" strokeLinecap="round" transform="rotate(-6 80 74)" />
        <path d="M50 30 L58 46 M110 30 L102 46" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="28" r="5" fill={C.red} stroke={C.ink} strokeWidth="3" />
        <circle cx="110" cy="28" r="5" fill={C.red} stroke={C.ink} strokeWidth="3" />
        <ellipse cx="80" cy="76" rx="54" ry="48" fill={C.blue} stroke={C.ink} strokeWidth="3.5" />
        <path d="M40 60 Q52 52 62 60 M98 60 Q108 52 120 60" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="72" r="11" fill={C.card} stroke={C.ink} strokeWidth="3" />
        <circle cx="100" cy="72" r="11" fill={C.card} stroke={C.ink} strokeWidth="3" />
        <circle cx={hp > 0.4 ? 62 : 57} cy="73" r="4.5" fill={C.ink} />
        <circle cx={hp > 0.4 ? 98 : 103} cy="73" r="4.5" fill={C.ink} />
        <path d={hp > 0.4 ? 'M62 100 L70 94 L78 100 L86 94 L94 100' : 'M64 98 Q80 108 96 98'} stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </motion.svg>
  )
}

export default function Boss({ unitId, go }) {
  const u = units.find((x) => x.id === unitId)
  const quiz = u.content.quiz
  const p = useProgress()

  // جولة مراجعة من أسئلة المحطات، ثم الضربة النهائية بأسئلة تقويم الوحدة كما في الكتاب
  const rounds = useMemo(() => {
    const review = u.content.stations
      .flatMap((s) => s.blocks.filter((b) => b.t === 'check'))
      .map((b) => ({ ...b, label: 'جولة مراجعة', shuffle: true }))
    const book = quiz.questions.map((q) => ({ ...q, label: `${quiz.h} — من الكتاب`, shuffle: false, book: true, why: '' }))
    return [...review, ...book]
  }, [u, quiz])

  const [k, setK] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [hits, setHits] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [state, setState] = useState('intro') // intro | fight | win | lose
  const monster = useAnimationControls()

  const hp = 1 - hits / rounds.length

  const onAnswer = (ok) => {
    setAnswered(true)
    if (ok) {
      setHits((h) => h + 1)
      sfx.hit()
      monster.start({ x: [0, 18, -14, 8, 0], scale: [1, 0.9, 1], transition: { duration: 0.5 } })
    } else {
      setLives((l) => l - 1)
      monster.start({ scale: [1, 1.15, 1], transition: { duration: 0.4 } })
    }
  }

  const next = () => {
    setAnswered(false)
    if (lives <= 0) {
      sfx.wrong()
      return setState('lose')
    }
    if (k === rounds.length - 1) {
      sfx.win()
      setState('win')
      const key = `${u.id}:boss`
      p.completeStation(key, lives === LIVES ? 3 : lives === 2 ? 2 : 1, 100 + lives * 25)
      p.award('unit1')
      confetti({ particleCount: 220, spread: 110, origin: { y: 0.35 } })
      return
    }
    setK(k + 1)
  }

  const restart = () => {
    setK(0)
    setLives(LIVES)
    setHits(0)
    setAnswered(false)
    setState('fight')
  }

  const r = rounds[k]

  return (
    <div className="player">
      <TopBar title="تقويم الوحدة" onBack={() => go({ name: 'unit', unit: u.id })} />

      {state === 'intro' && (
        <motion.div className="done-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Monster hp={1} controls={monster} />
          <h1 style={{ fontSize: '1.7rem' }}>
            <span className="grad-text">عملاق الغموض</span>
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            يحاول العملاق إخفاء كل ما تعلمته عن النماذج العلمية! كل إجابة صحيحة تضعفه، ولديك {toAr(LIVES)} قلوب فقط.
          </p>
          <div className="card" style={{ padding: 14, width: '100%', textAlign: 'start' }}>
            <div className="row">
              <Icon name="Zap" color={C.text} fill={C.yellow} /> جولة مراجعة من المحطات: {toAr(rounds.length - quiz.questions.length)} أسئلة
            </div>
            <div className="row">
              <Icon name="BookOpen" color={C.blue} /> الضربة النهائية: أسئلة تقويم الوحدة من الكتاب ({toAr(quiz.questions.length)})
            </div>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => setState('fight')}>
            <Icon name="Swords" /> ابدأ التحدي
          </button>
        </motion.div>
      )}

      {state === 'fight' && (
        <div className="stage">
          <div className="card boss-hud">
            <div className="row">
              <b style={{ fontFamily: 'var(--font-head)' }}>عملاق الغموض</b>
              <span className="spacer" />
              <span className="hearts">
                {Array.from({ length: LIVES }, (_, n) => (
                  <Icon key={n} name="Heart" size={20} color={C.text} strokeWidth={2} fill={n < lives ? C.red : 'none'} />
                ))}
              </span>
            </div>
            <div className="hp">
              <div style={{ width: `${hp * 100}%` }} />
            </div>
          </div>
          <div className="boss-monster">
            <Monster hp={hp} controls={monster} />
          </div>
          <div className="src-label">
            السؤال {toAr(k + 1)} من {toAr(rounds.length)}
          </div>
          {r.book && k === rounds.length - quiz.questions.length && (
            <div className="book" style={{ padding: '12px 16px' }}>
              <SourceTag page={quiz.page} />
              <b style={{ color: 'var(--red)' }}>{quiz.sub}</b>
            </div>
          )}
          <QuickCheck key={k} q={r.q} options={r.options} a={r.a} why={r.why} shuffle={r.shuffle} label={r.label} showLetters={!r.book} onAnswer={onAnswer} />
          {answered && (
            <motion.button className="btn btn-primary btn-block" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={next}>
              {lives <= 0 ? 'انتهت القلوب' : k === rounds.length - 1 ? 'الضربة القاضية!' : 'السؤال التالي'} <Icon name="ArrowLeft" />
            </motion.button>
          )}
        </div>
      )}

      {state === 'win' && (
        <motion.div className="done-screen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring' }}>
            <Icon name="Crown" size={90} color={C.text} fill={C.yellow} strokeWidth={1.6} />
          </motion.div>
          <h1 style={{ fontSize: '1.8rem' }}>
            <span className="grad-text">انتصرت! أنت سيد النماذج</span>
          </h1>
          <div className="xp-pill">+{toAr(100 + lives * 25)} XP</div>
          <p className="muted" style={{ margin: 0 }}>
            أنهيت الوحدة الأولى كاملة. الوحدة الثانية «الشحنة الكهربائية والقوى الكهربائية» قادمة قريباً.
          </p>
          <button className="btn btn-primary btn-block" onClick={() => go({ name: 'home' })}>
            <Icon name="Rocket" /> العودة إلى خريطة الرحلة
          </button>
        </motion.div>
      )}

      {state === 'lose' && (
        <motion.div className="done-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Monster hp={hp} controls={monster} />
          <h1 style={{ fontSize: '1.6rem' }}>نفدت القلوب!</h1>
          <p className="muted" style={{ margin: 0 }}>
            لا بأس، العلماء أيضاً يعيدون التجربة. راجع المحطات ثم حاول مجدداً.
          </p>
          <button className="btn btn-primary btn-block" onClick={restart}>
            <Icon name="RotateCcw" /> حاول مرة أخرى
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => go({ name: 'unit', unit: u.id })}>
            مراجعة المحطات
          </button>
        </motion.div>
      )}
    </div>
  )
}
