import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'book/*.jpg', 'voice/*.mp3'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,jpg,png,woff2,mp3}'],
      },
      manifest: {
        name: 'مختبر العلوم — الصف الثالث المتوسط',
        short_name: 'مختبر العلوم',
        description: 'منهج العلوم الطبيعية للصف الثالث المتوسط بشكل تفاعلي — الفكرة والتنفيذ: شركة إكسبيرينس ميديا',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#070b1f',
        background_color: '#070b1f',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
