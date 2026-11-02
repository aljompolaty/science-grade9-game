import Icon from './Icon.jsx'

// تنويه حقوق الملكية: التطبيق لشركة إكسبيرينس ميديا، ومحتوى الكتاب لجهته الأصلية
export default function Credits() {
  return (
    <footer className="credits">
      <div className="credits-brand">
        <span className="k">
          <Icon name="Sparkles" size={14} /> الفكرة والتنفيذ
        </span>
        <b>شركة إكسبيرينس ميديا</b>
      </div>
      <div>© ٢٠٢٦ جميع حقوق الملكية الفكرية للتطبيق محفوظة لشركة إكسبيرينس ميديا.</div>
      <div className="credits-src">
        محتوى الكتاب: المركز القومي للمناهج والبحث التربوي — جمهورية السودان.
      </div>
    </footer>
  )
}
