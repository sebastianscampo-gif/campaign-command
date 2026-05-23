import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/**
 * Configuración de tests. Reutiliza el alias `@` de Vite y usa `jsdom` para que
 * los stores con persistencia (localStorage) y cualquier código que toque DOM
 * funcione sin extras. Tests viven en `**__tests__**` co-locados con su módulo.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
  },
});
