/// <reference types="vite/client" />

/**
 * Variables que Vite inyecta en `import.meta.env` en tiempo de build (solo las prefijadas `VITE_` llegan al cliente).
 * Declara cada una aquí para que TypeScript reconozca las claves del `.env`.
 */
interface ImportMetaEnv {
  /** Cadena `'true'` → `fetchProducts` llama al backend; cualquier otro valor → catálogo estático `catalog.ts`. */
  readonly VITE_USE_API?: string;
  /** Base del API desde el navegador (típ. `/api` con proxy en dev o Nginx en prod). */
  readonly VITE_API_BASE_URL?: string;
  /** Solo dev: URL del backend para `vite.config` proxy `/api` (p. ej. `http://127.0.0.1:8086`). */
  readonly VITE_DEV_API_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
