import { createContext, useContext } from 'react'

// دالة التنقل بين الشاشات، متاحة لأي مكوّن (مثل زر العودة للرئيسية في الشريط العلوي)
export const NavContext = createContext(() => {})
export const useNav = () => useContext(NavContext)
