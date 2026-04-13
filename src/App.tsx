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
