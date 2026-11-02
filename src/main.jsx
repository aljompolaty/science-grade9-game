import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/noto-kufi-arabic/700.css'
import '@fontsource/noto-kufi-arabic/800.css'
import '@fontsource/noto-kufi-arabic/900.css'
import '@fontsource/playpen-sans-arabic/500.css'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
