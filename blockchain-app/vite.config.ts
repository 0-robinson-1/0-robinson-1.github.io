import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/blockchain/' : '/',
  plugins: [react()],
  server: {
    // this opens the given path in your browser; you can also just set `open: true`
    open: mode === 'production' ? '/blockchain/' : '/',
    // <<< proxy section >>>
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite is optional here if you’re calling exactly "/api/..."
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
}))