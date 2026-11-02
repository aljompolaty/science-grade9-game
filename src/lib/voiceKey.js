// اسم ملف التسجيل الصوتي لكل جملة من شرح المعلم، مشتق من نص الجملة نفسه
// (تغيير نص الشرح يعني ملفاً جديداً، فلا يُشغَّل تسجيل قديم لا يطابق النص)
export function voiceFile(text) {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
  return `voice/${h.toString(36)}.mp3`
}
