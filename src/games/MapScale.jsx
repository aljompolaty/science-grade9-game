import { motion } from 'framer-motion'
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { SourceTag, toAr } from '../components/BookBlocks.jsx'
import { sfx } from '../lib/sfx.js'
import { WinBanner } from './GameShell.jsx'

const fromAr = (s) => s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[٫,]/g, '.')

// تطبيق الرياضيات: قِس المسافة على الخريطة ثم حوّلها بمقياس الرسم
export default function MapScale({ b, onDone }) {
  const [cm, setCm] = useState(0)
  const [ans, setAns] = useState('')
  const [state, setState] = useState(null) // ok | no
  const [hint, setHint] = useState(false)
  const measured = Math.abs(cm - b.cm) < 0.01
  const MAX = 10
  const pct = (v) => (v / MAX) * 100

  const check = () => {
    const v = parseFloat(fromAr(ans))
    if (v === b.cm * b.scale) {
      setState('ok')
      sfx.win()
      onDone({ perfect: !hint })
    } else {
      setState('no')
      sfx.wrong()
    }
  }

  return (
    <>
      <article className="book">
        <SourceTag page={b.page} />
        <h3>{b.h}</h3>
        <p>{b.p}</p>
      </article>

      <section className="card game">
        <div className="game-head">
          <span className="g-ico">
            <Icon name="Ruler" size={20} />
          </span>
          <h3>المسطرة التفاعلية</h3>
        </div>
        <p className="muted" style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>
          ١) حرّك المسطرة حتى تصل إلى المدينة الثانية. ٢) احسب المسافة الحقيقية.
        </p>

        <div className="map-card">
          <div className="src-label" style={{ marginBottom: 8 }}>
            <Icon name="MapPin" size={14} /> خريطة توضيحية — مقياس الرسم: ١ سم = ١٠ كم
          </div>
          <div style={{ position: 'relative', height: 80, direction: 'ltr' }}>
            <svg width="100%" height="80" style={{ position: 'absolute', inset: 0 }}>
              <path d="M0 60 C 60 20, 120 70, 200 35 S 330 60, 420 25" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="6" fill="none" />
            </svg>
            <div style={{ position: 'absolute', left: '0%', top: 18, transform: 'translateX(-2px)' }}>
              <Icon name="MapPin" size={30} color="var(--ink)" fill="var(--teal)" />
            </div>
            <div style={{ position: 'absolute', left: `${pct(b.cm)}%`, top: 18, transform: 'translateX(-14px)' }}>
              <Icon name="MapPin" size={30} color="var(--ink)" fill="var(--red)" />
            </div>
            <motion.div
              style={{ position: 'absolute', left: 0, top: 50, height: 4, borderRadius: 4, background: measured ? 'var(--teal)' : 'var(--ink)' }}
              animate={{ width: `${pct(cm)}%` }}
            />
          </div>
          <div className="ruler">
            {Array.from({ length: MAX * 2 + 1 }, (_, i) => (
              <div key={i} className="tick" style={{ left: `${(i / (MAX * 2)) * 100}%`, height: i % 2 ? 10 : 20 }}>
                {i % 2 === 0 && <span>{i / 2}</span>}
              </div>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max={MAX}
            step="0.5"
            value={cm}
            onChange={(e) => {
              setCm(+e.target.value)
              sfx.tap()
            }}
            style={{ direction: 'ltr', marginTop: 10 }}
            aria-label="المسطرة"
          />
          <div className="center" style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.2rem' }}>
            {toAr(String(cm).replace('.', '٫'))} سم {measured && '✓'}
          </div>
        </div>

        {measured && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            <label style={{ fontWeight: 700 }}>كم كيلو متراً يفصل بين المدينتين؟</label>
            <input className="num-input" inputMode="decimal" value={ans} onChange={(e) => setAns(e.target.value)} placeholder="اكتب الرقم" />
            <div className="row">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={check} disabled={!ans || state === 'ok'}>
                <Icon name="Check" /> تحقق
              </button>
              <button className="btn btn-ghost" onClick={() => setHint(true)}>
                <Icon name="Lightbulb" /> تلميح
              </button>
            </div>
            {hint && state !== 'ok' && (
              <div className="feedback ok">
                <Icon name="Lightbulb" size={20} />
                <div>كل ١ سم يعادل ١٠ كم، إذن نضرب المسافة على الخريطة في ١٠: ٧٫٥ × ١٠ = ؟</div>
              </div>
            )}
            {state === 'no' && (
              <div className="feedback no">
                <Icon name="X" size={20} />
                <div>حاول مرة أخرى. اضرب عدد السنتيمترات في ١٠.</div>
              </div>
            )}
            {state === 'ok' && <WinBanner text="صحيح! ٧٫٥ × ١٠ = ٧٥ كيلو متراً." />}
          </motion.div>
        )}
      </section>
    </>
  )
}
