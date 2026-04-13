import { PRODUCTOS, type Product } from '../data/catalog';

function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && !Number.isNaN(v) ? v : undefined;
}

function normalizeRow(p: Record<string, unknown>): Product {
  const rawFotos = p.fotos;
  const fotos = Array.isArray(rawFotos)
    ? rawFotos
        .map((f) => (typeof f === 'string' ? f : asString((f as Record<string, unknown>)?.url)))
        .filter((x): x is string => Boolean(x))
    : [];
  const id = asNumber(p.id);
  const nombre = asString(p.nombre) ?? 'Producto';
  const categoria = asString(p.categoria) ?? asString(p.categoria_id) ?? 'personalizados';
  const precio = asNumber(p.precio) ?? 0;
  return {
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

function staticCatalog(): Product[] {
  return PRODUCTOS.map((p, i) => ({ ...p, id: p.id ?? i + 1 }));
}

export async function fetchProducts(): Promise<Product[]> {
  const useApi = import.meta.env.VITE_USE_API === 'true';
  if (!useApi) return staticCatalog();

  const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/productos`);
    if (!res.ok) throw new Error('bad status');
    const rows: unknown = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return staticCatalog();
    return rows.map((row) => normalizeRow(row as Record<string, unknown>));
  } catch {
    return staticCatalog();
  }
}
