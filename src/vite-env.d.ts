/// <reference types="vite/client" />

/**
 * Tipado de `import.meta.env`. Solo las variables `VITE_*` se exponen al código del navegador.
 */
interface ImportMetaEnv {
  /** `'true'` → se usa el backend; cualquier otro valor → catálogo estático `catalog.ts`. */
  readonly VITE_USE_API?: string;
  /** Base del API visto desde el cliente (típ. `/api`). */
  readonly VITE_API_BASE_URL?: string;
  /** Solo desarrollo: URL del backend para el proxy `/api` en `vite.config.ts`. */
  readonly VITE_DEV_API_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
