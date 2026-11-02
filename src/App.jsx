import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Icon from './components/Icon.jsx'
import Starfield from './components/Starfield.jsx'
import { NavContext } from './lib/nav.js'
import { setSoundEnabled, sfx } from './lib/sfx.js'
import { BADGES, ProgressProvider, useProgress } from './lib/store.jsx'
import Boss from './screens/Boss.jsx'
import Home from './screens/Home.jsx'
import Profile from './screens/Profile.jsx'
import Station from './screens/Station.jsx'
import Unit from './screens/Unit.jsx'

function Toast() {
  const { toast, clearToast } = useProgress()
  useEffect(() => {
    if (!toast) return
    sfx.win()
    const id = setTimeout(clearToast, 3200)
    return () => clearTimeout(id)
  }, [toast, clearToast])
  const b = toast && BADGES[toast.id]
  return (
    <AnimatePresence>
      {b && (
        <motion.div className="toast" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} onClick={clearToast}>
          <span className="t-ico">
            <Icon name={b.icon} size={24} />
          </span>
          <div>
            <div className="t-kicker">شارة جديدة!</div>
            <b style={{ fontFamily: 'var(--font-head)' }}>{b.title}</b> — <span className="muted">{b.desc}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Screens() {
  const [route, setRoute] = useState({ name: 'home' })
  const { sound } = useProgress()

  useEffect(() => setSoundEnabled(sound), [sound])

  const go = (r) => {
    setRoute(r)
    window.scrollTo({ top: 0 })
  }

  const key = `${route.name}-${route.unit || ''}-${route.station || ''}`

  return (
    <NavContext.Provider value={go}>
      <AnimatePresence mode="wait">
        <motion.main key={key} className="app" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          {route.name === 'home' && <Home go={go} />}
          {route.name === 'unit' && <Unit unitId={route.unit} go={go} />}
          {route.name === 'station' && <Station unitId={route.unit} stationId={route.station} go={go} />}
          {route.name === 'boss' && <Boss unitId={route.unit} go={go} />}
          {route.name === 'profile' && <Profile go={go} />}
        </motion.main>
      </AnimatePresence>
    </NavContext.Provider>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Starfield />
      <Toast />
      <Screens />
    </ProgressProvider>
  )
}
