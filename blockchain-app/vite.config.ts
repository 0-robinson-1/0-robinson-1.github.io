import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/blockchain/' : '/',
  plugins: [react()],
  server: {
    open: mode === 'production' ? '/blockchain/' : '/',
  },
}))
