import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'science9-progress-v1'

const empty = { xp: 0, done: {}, stars: {}, badges: [], streak: { day: null, count: 0 }, voice: true, sound: true, name: '' }

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

export const BADGES = {
  first: { title: 'أول خطوة', desc: 'أنهيت أول محطة', icon: 'Footprints' },
  box: { title: 'محقق الصندوق', desc: 'اختبرت فرضيتك بنموذج', icon: 'Box' },
  classify: { title: 'خبير التصنيف', desc: 'صنفت أنواع النماذج دون أخطاء', icon: 'Shapes' },
  sketch: { title: 'الرسام العالِم', desc: 'وصلت بنموذجك إلى دقة ١٠٠٪', icon: 'PenTool' },
  solar: { title: 'مطوّر النماذج', desc: 'طوّرت نموذج النظام الشمسي', icon: 'Orbit' },
  math: { title: 'مهندس الخرائط', desc: 'حللت مسألة مقياس الرسم', icon: 'Ruler' },
  unit1: { title: 'سيد النماذج', desc: 'هزمت تحدي الوحدة الأولى', icon: 'Crown' },
}

// المستوى كل ٢٠٠ نقطة
export const levelOf = (xp) => Math.floor(xp / 200) + 1
export const levelProgress = (xp) => (xp % 200) / 200

const Ctx = createContext(null)

export function ProgressProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // التخزين غير متاح (تصفح خاص) — يستمر التطبيق دون حفظ
    }
  }, [state])

  // سلسلة الأيام المتتالية
  useEffect(() => {
    const today = new Date().toDateString()
    setState((s) => {
      if (s.streak.day === today) return s
      const yesterday = new Date(Date.now() - 864e5).toDateString()
      const count = s.streak.day === yesterday ? s.streak.count + 1 : 1
      return { ...s, streak: { day: today, count } }
    })
  }, [])

  const addXp = useCallback((n) => setState((s) => ({ ...s, xp: s.xp + n })), [])

  const award = useCallback((id) => {
    setState((s) => {
      if (s.badges.includes(id)) return s
      setTimeout(() => setToast({ kind: 'badge', id }), 400)
      return { ...s, badges: [...s.badges, id] }
    })
  }, [])

  const completeStation = useCallback((key, stars, xp) => {
    setState((s) => ({
      ...s,
      xp: s.xp + xp,
      done: { ...s.done, [key]: true },
      stars: { ...s.stars, [key]: Math.max(stars, s.stars[key] || 0) },
    }))
  }, [])

  const setPref = useCallback((k, v) => setState((s) => ({ ...s, [k]: v })), [])
  const reset = useCallback(() => setState({ ...empty, streak: { day: new Date().toDateString(), count: 1 } }), [])

  const value = useMemo(
    () => ({ ...state, addXp, award, completeStation, setPref, reset, toast, clearToast: () => setToast(null) }),
    [state, addXp, award, completeStation, setPref, reset, toast],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useProgress = () => useContext(Ctx)
