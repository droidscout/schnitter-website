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
    minify: false,
    assetsInlineLimit: 0,
    sourcemap: true,
    rollupOptions: {
      treeshake: false,       // keine Entfernung ungenutzter Importe
      output: {
        compact: false,       // keine komprimierte Ausgabe
      },
    },
  }
});
