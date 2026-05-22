import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * En desarrollo el sitio vive en la raíz (http://localhost:5173/).
 * En el build de producción se sirve desde /campaign-command/ porque
 * GitHub Pages publica los project sites bajo el nombre del repo.
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/campaign-command/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));
