/**
 * Raíz de la SPA: envuelve la tienda en `CartProvider` para que cualquier pantalla use `useCart()`.
 * Los estilos globales (Tailwind import + CSS de marca) se cargan una sola vez aquí.
 */
import { CartProvider } from './context/CartContext';
import { StorefrontPage } from './pages/StorefrontPage';
import './styles.css';

export default function App() {
  return (
    <CartProvider>
      <StorefrontPage />
    </CartProvider>
  );
}
