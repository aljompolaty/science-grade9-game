import { motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'

export default function GameShell({ icon = 'Puzzle', title, intro, children, right }) {
  return (
    <motion.section className="card game" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="game-head">
        <span className="g-ico">
          <Icon name={icon} size={20} />
        </span>
        <h3>{title}</h3>
        {right}
      </div>
      {intro && <p className="muted" style={{ margin: '0 0 6px', fontSize: '0.95rem' }}>{intro}</p>}
      {children}
    </motion.section>
  )
}

export function WinBanner({ text }) {
  return (
    <motion.div
      className="feedback ok"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
    >
      <Icon name="Trophy" size={22} color="var(--ink)" fill="var(--yellow)" />
      <div>{text}</div>
    </motion.div>
  )
}
