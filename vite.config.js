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
    minify: false,          // deaktiviert JS- und CSS-Minifizierung
    assetsInlineLimit: 0,   // keine Base64-Inlines
    sourcemap: true,        // behält Source Maps bei
  },
});
