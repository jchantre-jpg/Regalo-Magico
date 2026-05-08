/**
 * Configuración de Vite (bundler y servidor de desarrollo).
 *
 * - `plugins`: React (JSX/TSX rápido) + Tailwind v4 integrado.
 * - `server.proxy['/api']`: en desarrollo, las peticiones a http://localhost:517x/api/*
 *   se reenvían al backend (por defecto puerto host 8086). Cambia con .env → VITE_DEV_API_PROXY.
 */
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  /** Prefijo vacío = leer todas las entradas del `.env` (necesario para `VITE_DEV_API_PROXY`). */
  const env = loadEnv(mode, process.cwd(), '');
  /** Backend Express cuando trabajas con Docker Compose (mapeo típico 8086→8085). */
  const proxyTarget = env.VITE_DEV_API_PROXY || 'http://127.0.0.1:8086';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          /** Host header del destino (útil si el backend valida origen). */
          changeOrigin: true,
        },
      },
    },
  };
});
