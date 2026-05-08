/**
 * Raíz de la interfaz: envuelve toda la tienda en `CartProvider` para que cualquier hijo use `useCart()`.
 * `styles.css` se importa aquí una vez para toda la app (Tailwind + estilos de marca).
 */
import { CartProvider } from './context/CartContext';
import { StorefrontPage } from './pages/StorefrontPage';
import './styles.css';

export default function App() {
  return (
    <>
      {/* Toda la UX comercial vive en una página; routing extra iría aquí si crece el sitio. */}
      <CartProvider>
        <StorefrontPage />
      </CartProvider>
    </>
  );
}
