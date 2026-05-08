/**
 * Hook de dominio: carga el catálogo una sola vez al montar la página.
 * `ready` permite mostrar “Cargando…” hasta que `fetchProducts` termina (API o datos estáticos).
 */
import { useEffect, useState } from 'react';
import type { Product } from '../data/catalog';
import { fetchProducts } from '../services/fetchProducts';

export function useProductsCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /** Evita setState si el usuario cierra la pestaña antes de que termine el fetch. */
    let alive = true;
    (async () => {
      const list = await fetchProducts();
      if (alive) {
        setProducts(list);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { products, ready };
}
