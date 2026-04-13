import { useEffect, useState } from 'react';
import type { Product } from '../data/catalog';
import { fetchProducts } from '../services/fetchProducts';

export function useProductsCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
