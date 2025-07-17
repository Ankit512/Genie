import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  base: mode === 'production' ? '/Genie/' : '/', // GitHub Pages repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})); 
