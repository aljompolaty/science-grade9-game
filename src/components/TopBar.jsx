import { useNav } from '../lib/nav.js'
import { useProgress } from '../lib/store.jsx'
import { toAr } from './BookBlocks.jsx'
import Icon from './Icon.jsx'

export default function TopBar({ title, onBack, right }) {
  const { xp, streak } = useProgress()
  const go = useNav()
  return (
    <div className="topbar">
      {onBack && (
        <button className="icon-btn" onClick={onBack} aria-label="رجوع">
          <Icon name="ArrowRight" />
        </button>
      )}
      <div className="title">{title}</div>
      {right}
      <span className="stat" title="أيام متتالية ونقاط الخبرة">
        <Icon name="Flame" size={15} color="var(--red)" /> {toAr(streak.count)}
        <span className="stat-sep" />
        <Icon name="Zap" size={15} color="var(--ink)" fill="var(--yellow)" /> {toAr(xp)}
      </span>
      <button className="icon-btn home-btn" onClick={() => go({ name: 'home' })} aria-label="الصفحة الرئيسية" title="الصفحة الرئيسية">
        <Icon name="House" />
      </button>
    </div>
  )
}
