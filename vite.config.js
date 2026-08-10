import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://clint-eqmhr8c23-riyad899s-projects.vercel.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

