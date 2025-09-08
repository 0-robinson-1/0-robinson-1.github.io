import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/blockchain/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',  // Use default for Vercel compatibility
  },
  define: {
    global: 'window',  // Global polyfill for Node-like env
    'process.env': {},  // Mock process.env
    Buffer: Buffer,  // Global Buffer polyfill for Solana
  },
  resolve: {
    alias: {
      buffer: 'buffer',  // Ensure Buffer resolution
    },
  },
  server: {
    open: mode === 'production' ? '/blockchain/' : '/',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}));