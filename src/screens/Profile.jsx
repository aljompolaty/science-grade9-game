import { motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import Credits from '../components/Credits.jsx'
import TopBar from '../components/TopBar.jsx'
import { stopSpeaking } from '../lib/speech.js'
import { BADGES, levelOf, useProgress } from '../lib/store.jsx'

function Toggle({ on, onClick, icon, label, note }) {
  return (
    <button className="card station-row" onClick={onClick}>
      <span className="s-icon">
        <Icon name={icon} />
      </span>
      <span className="s-body">
        <h4>{label}</h4>
        {note && (
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            {note}
          </span>
        )}
      </span>
      <span className="chip" style={{ borderColor: on ? 'var(--teal)' : 'var(--ink)', color: on ? 'var(--teal)' : 'var(--ink-2)' }}>
        {on ? 'مفعّل' : 'متوقف'}
      </span>
    </button>
  )
}

export default function Profile({ go }) {
  const p = useProgress()
  const done = Object.keys(p.done).length

  return (
    <div>
      <TopBar title="إنجازاتي" onBack={() => go({ name: 'home' })} />

      <div className="card level-card">
        <div className="level-row">
          <div className="level-badge">{toAr(levelOf(p.xp))}</div>
          <div>
            <b style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem' }}>المستكشف العلمي</b>
            <div className="muted" style={{ fontSize: '0.88rem' }}>
              {toAr(p.xp)} نقطة · {toAr(done)} محطات منجزة · {toAr(p.streak.count)} أيام متتالية
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-h">
        <Icon name="Trophy" /> الشارات
      </h2>
      <div className="badges">
        {Object.entries(BADGES).map(([id, b], i) => {
          const has = p.badges.includes(id)
          return (
            <motion.div key={id} className={`card badge ${has ? '' : 'off'}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: has ? 1 : 0.35, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <span className="b-ico">
                <Icon name={has ? b.icon : 'Lock'} size={26} />
              </span>
              <b>{b.title}</b>
              <span className="muted">{b.desc}</span>
            </motion.div>
          )
        })}
      </div>

      <h2 className="section-h">
        <Icon name="Settings" /> الإعدادات
      </h2>
      <div className="stations">
        <Toggle
          on={p.voice}
          icon={p.voice ? 'Volume2' : 'VolumeX'}
          label="صوت المعلم نور"
          note="شرح مسجّل بصوت يوسف (ElevenLabs)"
          onClick={() => {
            stopSpeaking()
            p.setPref('voice', !p.voice)
          }}
        />
        <Toggle on={p.sound} icon="Sparkles" label="المؤثرات الصوتية" onClick={() => p.setPref('sound', !p.sound)} />
        <button
          className="card station-row"
          onClick={() => {
            if (confirm('هل تريد مسح كل التقدم والبدء من جديد؟')) p.reset()
          }}
        >
          <span className="s-icon">
            <Icon name="RotateCcw" />
          </span>
          <span className="s-body">
            <h4>البدء من جديد</h4>
            <span className="muted" style={{ fontSize: '0.8rem' }}>
              مسح النقاط والشارات والمحطات المنجزة على هذا الجهاز
            </span>
          </span>
        </button>
      </div>

      <Credits />
    </div>
  )
}
