/** Rutas de `public/` o URLs absolutas para <img src>. */
export function publicUrl(path: string | undefined | null): string {
  if (!path) return '';
  const s = String(path).trim();
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith('/') ? s : `/${s}`;
}
