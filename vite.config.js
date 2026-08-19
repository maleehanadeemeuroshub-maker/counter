import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // flow-wave.html is a second, plain-Three.js entry point (no React) —
      // list it so `vite build` emits it into dist/ alongside the main app.
      // Both entries resolve "three" through the npm dependency below.
      input: {
        main: resolvePath('index.html'),
        flowWave: resolvePath('flow-wave.html'),
      },
    },
  },
});
