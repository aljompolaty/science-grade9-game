import { useEffect, useRef } from 'react'

// سماء نجوم متلألئة تتحرك ببطء خلف كل الشاشات
export default function Starfield() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const g = c.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, stars, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const init = () => {
      w = c.width = innerWidth * dpr
      h = c.height = innerHeight * dpr
      stars = Array.from({ length: Math.round((innerWidth * innerHeight) / 5000) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.3 + 0.3) * dpr,
        s: Math.random() * 0.15 + 0.03,
        p: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.15 ? (Math.random() < 0.5 ? 190 : 280) : 0,
      }))
    }

    const draw = (t) => {
      g.clearRect(0, 0, w, h)
      for (const s of stars) {
        const a = 0.45 + 0.55 * Math.sin(t / 900 + s.p)
        g.fillStyle = s.hue ? `hsla(${s.hue},90%,75%,${a})` : `rgba(255,255,255,${a * 0.9})`
        g.beginPath()
        g.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        g.fill()
        if (!reduce) {
          s.y += s.s * dpr
          if (s.y > h) s.y = 0
        }
      }
      raf = requestAnimationFrame(draw)
    }

    init()
    raf = requestAnimationFrame(draw)
    addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', init)
    }
  }, [])

  return (
    <div className="space" aria-hidden>
      <canvas ref={ref} />
    </div>
  )
}
