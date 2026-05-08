/**
 * Origen del catálogo que consume la tienda.
 *
 * Si `import.meta.env.VITE_USE_API === 'true'`: GET `{base}/productos` (base suele ser `/api` → proxy Vite en dev).
 * Si falla la red o la lista viene vacía: usa `PRODUCTOS` de catalog.ts como respaldo.
 *
 * Variables (.env): VITE_USE_API, VITE_API_BASE_URL (ej. `/api`).
 */
import { PRODUCTOS, type Product } from '../data/catalog';

/** Conversión segura desde JSON del backend (tipos desconocidos). */
function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

/** Solo números que no sean NaN (JSON puede traer basura). */
function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && !Number.isNaN(v) ? v : undefined;
}

/** Adapta una fila JSON del API al tipo `Product` que esperan React y el carrito. */
function normalizeRow(p: Record<string, unknown>): Product {
  const rawFotos = p.fotos;
  /** Backend guarda array de strings; si viniera `{ url }` (otro cliente), tomamos `url`. */
  const fotos = Array.isArray(rawFotos)
    ? rawFotos
        .map((f) => (typeof f === 'string' ? f : asString((f as Record<string, unknown>)?.url)))
        .filter((x): x is string => Boolean(x))
    : [];
  const id = asNumber(p.id);
  const nombre = asString(p.nombre) ?? 'Producto';
  /** Compatibilidad por si el API en el futuro usa otro nombre de campo para la categoría. */
  const categoria = asString(p.categoria) ?? asString(p.categoria_id) ?? 'personalizados';
  const precio = asNumber(p.precio) ?? 0;
  return {
    /* Si el API omite id numérico, 0 evita undefined pero conviene que el backend siempre envíe id. */
    id: id ?? 0,
    nombre,
    categoria,
    precio,
    emoji: asString(p.emoji) ?? '🎁',
    descripcion: asString(p.descripcion),
    contenido: asString(p.contenido),
    fotos,
  };
}

/** Lista del archivo catalog.ts con ids garantizados (cada fila tiene número > 0). */
function staticCatalog(): Product[] {
  return PRODUCTOS.map((p, i) => ({ ...p, id: p.id ?? i + 1 }));
}

export async function fetchProducts(): Promise<Product[]> {
  /** En build, `env` son strings: solo `'true'` activa el fetch remoto. */
  const useApi = import.meta.env.VITE_USE_API === 'true';
  if (!useApi) return staticCatalog();

  /** Sin barra final: evita `//productos` si alguien configura base con `/`. */
  const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/productos`);
    if (!res.ok) throw new Error('bad status');
    const rows: unknown = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return staticCatalog();
    return rows.map((row) => normalizeRow(row as Record<string, unknown>));
  } catch {
    /** Sin ruido en consola: la tienda sigue funcionando con datos embebidos. */
    return staticCatalog();
  }
}
