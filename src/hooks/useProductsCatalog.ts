/**
 * Hook que carga el catálogo una vez al montar la página.
 * Expone `ready` para poder mostrar carga/esqueleto si fuera necesario.
 */
import { useEffect, useState } from 'react';
import type { Product } from '../data/catalog';
import { fetchProducts } from '../services/fetchProducts';

export function useProductsCatalog() {
  /** Vacío hasta que termina la primera carga (`fetchProducts` puede tardar en API lenta). */
  const [products, setProducts] = useState<Product[]>([]);
  /** `false` hasta obtener lista final (vacía o con ítems); la tienda muestra “Cargando…” mientras tanto. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /** Si el usuario navega antes de que termine fetch, no actualizar estado en componente desmontado. */
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
