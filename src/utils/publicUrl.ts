/**
 * Convierte rutas guardadas en el catálogo (`/imagenes/foo.jpg`) en URL válida para <img src>.
 * Si ya es http/https la devuelve igual.
 */
export function publicUrl(path: string | undefined | null): string {
  if (!path) return '';
  const s = String(path).trim();
  /* Catálogo remoto o CDN: devolver tal cual para que el navegador resuelva el host. */
  if (/^https?:\/\//i.test(s)) return s;
  /* Rutas relativas al origen del sitio (Vite sirve `public/` en la raíz). */
  return s.startsWith('/') ? s : `/${s}`;
}
