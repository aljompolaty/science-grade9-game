import { motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'
import { SourceTag, toAr } from '../components/BookBlocks.jsx'
import TopBar from '../components/TopBar.jsx'
import Teacher from '../components/Teacher.jsx'
import { ordinals, units } from '../data/units.js'
import { C } from '../lib/palette.js'
import { useProgress } from '../lib/store.jsx'
import { sfx } from '../lib/sfx.js'

function Stars({ n }) {
  return (
    <span className="stars">
      {[1, 2, 3].map((k) => (
        <Icon key={k} name="Star" size={16} color={C.text} fill={k <= n ? C.yellow : 'none'} strokeWidth={2} />
      ))}
    </span>
  )
}

export default function Unit({ unitId, go }) {
  const u = units.find((x) => x.id === unitId)
  const c = u.content
  const { done, stars } = useProgress()
  const keys = c.stations.map((s) => `${u.id}:${s.id}`)
  const firstVisit = !keys.some((k) => done[k])
  const allDone = keys.every((k) => done[k])

  return (
    <div>
      <TopBar title={`الوحدة ${ordinals[u.id - 1]}`} onBack={() => go({ name: 'home' })} />

      <motion.section className="unit-cover" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <motion.div className="unit-icon" initial={{ rotate: -14, scale: 0.8 }} animate={{ rotate: -4, scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
          <img src={u.icon} alt="" />
        </motion.div>
        <div>
          <div className="eyebrow">الوحدة {ordinals[u.id - 1]} · صفحة {toAr(u.page)}</div>
          <h1>{u.title}</h1>
        </div>
      </motion.section>

      {firstVisit && (
        <div style={{ margin: '14px 0' }}>
          <Teacher say={`مرحباً بك في الوحدة ${ordinals[u.id - 1]}: ${u.title}. قبل أن نبدأ، تعرّف على أهداف الوحدة وفكرتها الرئيسة، ثم انطلق في المحطات واحدة تلو الأخرى.`} />
        </div>
      )}

      <h2 className="section-h">
        <Icon name="Target" /> الأهداف
      </h2>
      <p className="muted" style={{ margin: '0 0 8px' }}>
        {c.objectivesLead}
      </p>
      {c.objectives.map((o, i) => (
        <motion.div key={i} className="objective" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
          <b>{toAr(i + 1)}</b>
          <span>{o}</span>
        </motion.div>
      ))}

      <h2 className="section-h">
        <Icon name="Lightbulb" /> الفكرة الرئيسة
      </h2>
      <motion.div className="idea-box" initial={{ opacity: 0, rotate: -4 }} whileInView={{ opacity: 1, rotate: -1 }} viewport={{ once: true }}>
        {c.mainIdea}
      </motion.div>

      <h2 className="section-h">
        <Icon name="BookOpen" /> المفردات الجديدة
      </h2>
      <div className="row" style={{ flexWrap: 'wrap' }}>
        {c.vocab.map((v) => (
          <span key={v} className="chip" style={{ fontSize: '1rem', padding: '4px 16px', background: 'var(--pink)', color: '#2a0a18', boxShadow: '2px 2px 0 var(--sh)' }}>
            {v}
          </span>
        ))}
      </div>

      <h2 className="section-h">
        <Icon name="Footprints" /> محطات الرحلة
      </h2>
      <div className="stations">
        {c.stations.map((s, i) => {
          const key = `${u.id}:${s.id}`
          const locked = i > 0 && !done[`${u.id}:${c.stations[i - 1].id}`]
          return (
            <motion.button
              key={s.id}
              className={`card station-row ${done[key] ? 'done' : ''} ${locked ? 'locked' : ''}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => {
                if (locked) return sfx.wrong()
                sfx.tap()
                go({ name: 'station', unit: u.id, station: s.id })
              }}
            >
              <span className="s-icon">
                <Icon name={locked ? 'Lock' : done[key] ? 'Check' : s.icon} />
              </span>
              <span className="s-body">
                <span className="muted" style={{ fontSize: '0.78rem' }}>
                  المحطة {toAr(i + 1)} · صفحة {s.pages}
                </span>
                <h4>{s.title}</h4>
              </span>
              {done[key] ? <Stars n={stars[key] || 0} /> : !locked && <Icon name="ChevronLeft" />}
            </motion.button>
          )
        })}

        <motion.button
          className={`card station-row boss-row ${allDone ? '' : 'locked'} ${done[`${u.id}:boss`] ? 'done' : ''}`}
          onClick={() => {
            if (!allDone) return sfx.wrong()
            sfx.tap()
            go({ name: 'boss', unit: u.id })
          }}
        >
          <span className="s-icon">
            <Icon name={allDone ? 'Swords' : 'Lock'} />
          </span>
          <span className="s-body">
            <span className="muted" style={{ fontSize: '0.78rem' }}>
              التحدي النهائي · صفحة {toAr(c.quiz.page)}
            </span>
            <h4>تقويم الوحدة</h4>
          </span>
          {done[`${u.id}:boss`] ? <Icon name="Crown" color={C.yellow} /> : allDone && <Icon name="ChevronLeft" />}
        </motion.button>
      </div>

      <p className="muted row" style={{ marginTop: 22, fontSize: '0.82rem', alignItems: 'flex-start', lineHeight: 1.7 }}>
        <Icon name="BookOpen" size={16} style={{ flex: 'none', marginTop: 3 }} />
        نصوص الكتاب وصوره معروضة كما هي دون تغيير في البطاقات المعلّمة «من الكتاب». شرح المعلم نور والألعاب للتبسيط فقط.
      </p>
    </div>
  )
}
