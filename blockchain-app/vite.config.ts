import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/blockchain/' : '/',
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,  // Polyfill Buffer for Solana
        global: true,
        process: true,  // Include process for other Node.js globals
      },
      protocolImports: true,  // Polyfill Node modules like crypto
    }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    open: mode === 'production' ? '/blockchain/' : '/',
  },
  define: {
    'process.env': {},
    global: 'globalThis',  // Standard globalThis for browser
  },
}));