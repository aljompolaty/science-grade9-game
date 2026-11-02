import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

// المتصفح يرسل beforeinstallprompt قبل أن يرسم أي شاشة، فنلتقطه مبكراً
let deferred = null
const listeners = new Set()
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e
    listeners.forEach((f) => f())
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    listeners.forEach((f) => f())
  })
}

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

// زر «ثبّت التطبيق على جهازك» — يظهر على أندرويد (Chrome) عندما يكون التثبيت متاحاً
export default function InstallButton() {
  const [canInstall, setCanInstall] = useState(!!deferred)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const update = () => {
      setCanInstall(!!deferred)
      setInstalled(isStandalone())
    }
    listeners.add(update)
    return () => listeners.delete(update)
  }, [])

  if (installed || !canInstall) return null

  const install = async () => {
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') deferred = null
    setCanInstall(!!deferred)
  }

  return (
    <button className="btn btn-primary btn-block install-btn" onClick={install}>
      <Icon name="Download" /> ثبّت التطبيق على جهازك
    </button>
  )
}
