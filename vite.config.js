import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/schnitter/',
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    minify: false,          // keine JS/CSS-Minifizierung
    cssMinify: false,       // keine CSS-Minifizierung
    assetsInlineLimit: 0,   // keine Base64-Inlines
    sourcemap: true,        // optional: Source Maps beibehalten
  },
});
