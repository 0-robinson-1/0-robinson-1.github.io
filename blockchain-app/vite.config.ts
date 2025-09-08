import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/blockchain/' : '/',  // Changed to '/blockchain/' to match App.tsx basename
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    open: mode === 'production' ? '/blockchain/' : '/',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional: Strip '/api' for clean calls
      },
    },
  },
  define: {
    'process.env': '{}',
    global: 'globalThis',  // Polyfill for Node globals
    Buffer: Buffer,  // Global Buffer polyfill for Solana
  },
  resolve: {
    alias: {
      buffer: 'buffer',  // Ensure Buffer resolution
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
}));