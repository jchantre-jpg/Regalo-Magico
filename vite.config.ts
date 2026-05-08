/**
 * Vite + React + Tailwind v4 (`@tailwindcss/vite`).
 * En desarrollo, `/api/*` se proxifica al backend (URL por defecto en esta rama o `VITE_DEV_API_PROXY` en `.env`).
 */
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_DEV_API_PROXY || 'http://127.0.0.1:8081';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
