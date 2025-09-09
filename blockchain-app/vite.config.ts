import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/blockchain/' : '/',
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    open: '/blockchain',  // Auto-open /blockchain
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Proxy to Vercel functions port
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),  // Keep /api prefix
      },
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
}));