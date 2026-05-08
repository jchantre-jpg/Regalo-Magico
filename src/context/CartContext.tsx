/**
 * Estado global del carrito de compras.
 *
 * - Persistencia en `localStorage` (clave STORAGE_KEY) para que recargar la página no borre el carrito.
 * - Expuesto mediante React Context: usa `useCart()` solo dentro de `<CartProvider>`.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../data/catalog';

/** Clave única en el navegador; cambiarla “vacía” el carrito de clientes antiguos. */
const STORAGE_KEY = 'regalomagico_cart';

/** Producto más cantidad en carrito (se serializa entero a localStorage). */
export type CartItem = Product & { quantity: number };

/** Contrato expuesto por `useCart()` para la tienda y futuros componentes hijos. */
type CartContextValue = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (id: number | string) => void;
  updateQty: (id: number | string, delta: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Lee carrito guardado; si JSON corrupto devuelve [] sin romper la app. */
function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitial);

  /** Sincroniza estado + localStorage (usado por `clear`; add/remove también escriben para no depender del orden). */
  const persist = useCallback((next: CartItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setItems(next);
  }, []);

  const add = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      /** Comparación en string: API puede mandar id numérico y el estático también; evita duplicar líneas. */
      const exist = prev.find((i) => String(i.id) === String(product.id));
      let next: CartItem[];
      if (exist) {
        next = prev.map((i) =>
          String(i.id) === String(product.id) ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        next = [...prev, { ...product, quantity }];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: number | string) => {
    setItems((prev) => {
      const next = prev.filter((i) => String(i.id) !== String(id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQty = useCallback((id: number | string, delta: number) => {
    setItems((prev) => {
      const next = prev.map((i) => {
        if (String(i.id) !== String(id)) return i;
        /** Mínimo 1 unidad; para “quitar del todo” usar `remove`. */
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  /** Suma precio × cantidad en COP (enteros como en catálogo). */
  const total = useMemo(() => items.reduce((s, i) => s + i.precio * i.quantity, 0), [items]);

  /** Unidades totales (badge del icono carrito). */
  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, add, remove, updateQty, clear, total, count }),
    [items, add, remove, updateQty, clear, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  /* Sin Provider el Context vale null — fallamos explícito para depurar rápido en desarrollo. */
  if (!ctx) throw new Error('useCart dentro de CartProvider');
  return ctx;
}
