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
      // flow-wave.html is a second, fully self-contained entry point (plain
      // Three.js, no React) — list it so `vite build` emits it into dist/.
      input: {
        main: resolvePath('index.html'),
        flowWave: resolvePath('flow-wave.html'),
      },
      // flow-wave.html resolves "three" itself via its own <script type="importmap">
      // at runtime (unpkg CDN) — it isn't an npm dependency, so Rollup must leave
      // those bare imports alone instead of trying to bundle them.
      external: (id) => id === 'three' || id.startsWith('three/'),
    },
  },
});
