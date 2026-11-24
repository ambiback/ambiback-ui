import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    // The AmbiBack Manager app embeds this UI in an Android WebView, and
    // Android 8-10 devices may still run WebView 64-74. Lower modern syntax
    // such as ?. and ?? so those WebViews can parse the bundle.
    target: ['es2017', 'chrome64', 'safari12'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AmbiBack Controller',
        short_name: 'AmbiBack',
        start_url: '/ambiback-ui/',
        display: 'standalone',
        background_color: '#0b0b0b',
        theme_color: '#0b0b0b',
      },
    }),
  ],
})
