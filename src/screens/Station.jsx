import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BookBlock, FigureBlock, InfoBlock, toAr } from '../components/BookBlocks.jsx'
import Icon from '../components/Icon.jsx'
import QuickCheck from '../components/QuickCheck.jsx'
import Teacher, { Bot } from '../components/Teacher.jsx'
import TopBar from '../components/TopBar.jsx'
import { units } from '../data/units.js'
import Classify from '../games/Classify.jsx'
import ClosedBox from '../games/ClosedBox.jsx'
import Flashcards from '../games/Flashcards.jsx'
import MapScale from '../games/MapScale.jsx'
import SelfTest from '../games/SelfTest.jsx'
import Sketch from '../games/Sketch.jsx'
import Solar from '../games/Solar.jsx'
import { stopSpeaking } from '../lib/speech.js'
import { useProgress } from '../lib/store.jsx'
import { sfx } from '../lib/sfx.js'

const GAMES = { classify: Classify, closedBox: ClosedBox, sketch: Sketch, solar: Solar }
const GAME_BADGE = { classify: 'classify', closedBox: 'box', sketch: 'sketch', solar: 'solar' }

// هل يحتاج المقطع إلى تفاعل قبل الانتقال؟
const needsAction = (b) => ['check', 'game', 'summary', 'math'].includes(b.t) || (b.t === 'figure' && b.hotspots)

export default function Station({ unitId, stationId, go }) {
  const u = units.find((x) => x.id === unitId)
  const st = u.content.stations.find((s) => s.id === stationId)
  const idxInUnit = u.content.stations.indexOf(st)
  const key = `${u.id}:${st.id}`
  const p = useProgress()

  const [i, setI] = useState(0)
  const [ready, setReady] = useState({})
  const [score, setScore] = useState({ checks: 0, right: 0, games: 0, perfect: 0 })
  const [finished, setFinished] = useState(false)
  const top = useRef(null)

  const blocks = st.blocks
  const b = blocks[i]
  const canNext = !needsAction(b) || ready[i]

  useEffect(() => {
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [i])

  useEffect(() => () => stopSpeaking(), [])

  const markReady = () => setReady((r) => ({ ...r, [i]: true }))

  const onCheck = (ok) => {
    setScore((s) => ({ ...s, checks: s.checks + 1, right: s.right + (ok ? 1 : 0) }))
    markReady()
  }

  const onGame = (res) => {
    if (ready[i]) return
    setScore((s) => ({ ...s, games: s.games + 1, perfect: s.perfect + (res?.perfect ? 1 : 0) }))
    if (b.t === 'game' && (res?.perfect || b.game !== 'classify')) p.award(GAME_BADGE[b.game])
    if (b.t === 'math') p.award('math')
    markReady()
  }

  const total = score.checks + score.games
  const good = score.right + score.perfect
  const starsEarned = total === 0 ? 3 : good === total ? 3 : good / total >= 0.5 ? 2 : 1
  const xpEarned = 40 + score.right * 10 + score.perfect * 20

  const next = () => {
    stopSpeaking()
    if (i < blocks.length - 1) {
      sfx.next()
      setI(i + 1)
    } else {
      sfx.win()
      setFinished(true)
      p.completeStation(key, starsEarned, xpEarned)
      p.award('first')
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.4 }, colors: ['#E2482D', '#0E7C66', '#2747C9', '#F5C431', '#F4A6BD'] })
    }
  }

  const nextStation = u.content.stations[idxInUnit + 1]

  if (finished) {
    return (
      <div>
        <TopBar title={st.title} onBack={() => go({ name: 'unit', unit: u.id })} />
        <motion.div className="done-screen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Bot size={120} mood="wow" />
          <h1 style={{ fontSize: '1.8rem' }}>
            <span className="grad-text">أنهيت المحطة!</span>
          </h1>
          <div className="big-stars">
            {[1, 2, 3].map((k) => (
              <motion.span key={k} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + k * 0.2, type: 'spring' }}>
                <Icon name="Star" size={48} color="var(--ink)" strokeWidth={2} fill={k <= starsEarned ? 'var(--yellow)' : 'none'} />
              </motion.span>
            ))}
          </div>
          <div className="xp-pill">+{toAr(xpEarned)} XP</div>
          {total > 0 && (
            <p className="muted" style={{ margin: 0 }}>
              أجبت بشكل مثالي في {toAr(good)} من {toAr(total)} تحديات
            </p>
          )}
          <div style={{ display: 'grid', gap: 10, width: '100%', marginTop: 10 }}>
            {nextStation ? (
              <button className="btn btn-primary btn-block" onClick={() => go({ name: 'station', unit: u.id, station: nextStation.id })}>
                المحطة التالية: {nextStation.title} <Icon name="ArrowLeft" />
              </button>
            ) : (
              <button className="btn btn-primary btn-block" onClick={() => go({ name: 'boss', unit: u.id })}>
                <Icon name="Swords" /> إلى تقويم الوحدة
              </button>
            )}
            <button className="btn btn-ghost btn-block" onClick={() => go({ name: 'unit', unit: u.id })}>
              العودة إلى الوحدة
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const Game = b.t === 'game' ? GAMES[b.game] : null

  return (
    <div className="player">
      <div ref={top} style={{ scrollMarginTop: 0 }} />
      <TopBar title={st.title} onBack={() => go({ name: 'unit', unit: u.id })} />
      <div className="progress">
        <div style={{ width: `${((i + (canNext ? 1 : 0.5)) / blocks.length) * 100}%` }} />
      </div>

      <div className="stage">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3 }} style={{ display: 'grid', gap: 14 }}>
            {b.t === 'teach' && <Teacher say={b.say} />}
            {b.t === 'book' && <BookBlock b={b} />}
            {b.t === 'info' && <InfoBlock b={b} />}
            {b.t === 'figure' && <FigureBlock b={b} onReady={markReady} />}
            {b.t === 'check' && <QuickCheck {...b} onAnswer={onCheck} />}
            {Game && <Game g={b} onDone={onGame} />}
            {b.t === 'summary' && <Flashcards b={b} onDone={markReady} />}
            {b.t === 'selfTest' && <SelfTest b={b} />}
            {b.t === 'math' && <MapScale b={b} onDone={onGame} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="dock">
        {i > 0 && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              stopSpeaking()
              setI(i - 1)
            }}
            aria-label="السابق"
          >
            <Icon name="ArrowRight" />
          </button>
        )}
        <button className="btn btn-primary" style={{ flex: 1 }} disabled={!canNext} onClick={next}>
          {canNext ? (i === blocks.length - 1 ? 'إنهاء المحطة' : 'التالي') : 'أكمل التحدي للمتابعة'}
          <Icon name={canNext ? 'ArrowLeft' : 'Lock'} />
        </button>
      </div>
    </div>
  )
}
