/**
 * Normaliza rutas del catálogo (`/imagenes/...`) para usarlas en `src` de `<img>`.
 * URLs http/https se devuelven sin cambios (CDN o enlaces absolutos).
 */
export function publicUrl(path: string | undefined | null): string {
  if (!path) return '';
  const s = String(path).trim();
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith('/') ? s : `/${s}`;
}
