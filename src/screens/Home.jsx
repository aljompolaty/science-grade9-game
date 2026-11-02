import { motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'
import { toAr } from '../components/BookBlocks.jsx'
import Credits from '../components/Credits.jsx'
import InstallButton from '../components/InstallButton.jsx'
import { Bot } from '../components/Teacher.jsx'
import { units, ordinals } from '../data/units.js'
import { C } from '../lib/palette.js'
import { levelOf, levelProgress, useProgress } from '../lib/store.jsx'
import { sfx } from '../lib/sfx.js'

export function unitStats(unit, done) {
  if (!unit.content) return { total: 0, done: 0 }
  const keys = unit.content.stations.map((s) => `${unit.id}:${s.id}`)
  return { total: keys.length + 1, done: keys.filter((k) => done[k]).length + (done[`${unit.id}:boss`] ? 1 : 0) }
}

export default function Home({ go }) {
  const p = useProgress()
  const lvl = levelOf(p.xp)

  return (
    <div>
      <div className="topbar">
        <div className="title">مختبر العلوم</div>
        <span className="stat" title="أيام متتالية">
          <Icon name="Flame" size={16} color={C.red} /> {toAr(p.streak.count)}
        </span>
        <button className="icon-btn" onClick={() => go({ name: 'profile' })} aria-label="إنجازاتي">
          <Icon name="Award" />
        </button>
      </div>

      <motion.section className="cover" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow">الصف الثالث المتوسط</div>
        <h1>العلوم الطبيعية</h1>
        <p>تساءل واستقص وتعلم</p>
        <span className="label">٧ وحدات · رحلة واحدة</span>
        <div className="bot-wrap">
          <Bot size={92} />
        </div>
      </motion.section>

      <motion.div className="card level-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="level-row">
          <div className="level-badge">{toAr(lvl)}</div>
          <div style={{ flex: 1 }}>
            <b style={{ fontFamily: 'var(--font-head)' }}>المستوى {toAr(lvl)}</b>
            <div className="muted" style={{ fontSize: '0.85rem' }}>
              {toAr(p.xp)} نقطة خبرة · {toAr(p.badges.length)} شارات
            </div>
          </div>
          <Icon name="Zap" size={26} color={C.text} fill={C.yellow} />
        </div>
        <div className="progress">
          <div style={{ width: `${levelProgress(p.xp) * 100}%` }} />
        </div>
      </motion.div>

      <InstallButton />

      <h2 className="section-h">
        <Icon name="BookOpen" /> فهرس الوحدات
      </h2>

      <div className="journey">
        {units.map((u, i) => {
          const locked = !u.content
          const st = unitStats(u, p.done)
          return (
            <motion.button
              key={u.id}
              className={`planet ${locked ? 'locked' : ''}`}
              style={{ '--c': u.color }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => {
                if (locked) return sfx.wrong()
                sfx.tap()
                go({ name: 'unit', unit: u.id })
              }}
              aria-disabled={locked}
            >
              <span className="num">{toAr(u.id)}</span>
              <div className="orb">
                <img src={u.icon} alt="" />
              </div>
              <div className="meta">
                <small>الوحدة {ordinals[i]} · صفحة {toAr(u.page)}</small>
                <h3>{u.title}</h3>
                {locked ? (
                  <small className="row" style={{ gap: 4 }}>
                    <Icon name="Lock" size={13} /> قريباً
                  </small>
                ) : (
                  <span className="chip" style={{ marginTop: 4 }}>
                    {toAr(st.done)} من {toAr(st.total)} محطات
                  </span>
                )}
              </div>
              {!locked && (
                <span className="go">
                  <Icon name="ChevronLeft" />
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <Credits />
    </div>
  )
}
