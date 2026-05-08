import type { CartItem } from '../context/CartContext';
import { formatPriceCOP } from '../utils/formatPrice';
import { ProductImage } from './ProductImage';
import { WhatsAppIcon } from './WhatsAppIcon';

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQty: (id: number | string, delta: number) => void;
  onRemove: (id: number | string) => void;
  onCheckout: () => void;
  onBrowseProducts: () => void;
};

export function CartSidebar({
  open,
  onClose,
  items,
  total,
  onUpdateQty,
  onRemove,
  onCheckout,
  onBrowseProducts,
}: Props) {
  return (
    <>
      <div
        className={`cart-overlay${open ? ' active' : ''}`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={`cart-sidebar${open ? ' active' : ''}`}
        id="cart-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!open}
      >
        <div className="cart-header">
          <h2 id="cart-title">Tu carrito</h2>
          <button type="button" className="cart-close" aria-label="Cerrar carrito" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty" id="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>Tu carrito está vacío</p>
              <button type="button" className="btn btn-outline" onClick={() => { onClose(); onBrowseProducts(); }}>
                Ver productos
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item" data-id={item.id}>
                  <div className="cart-item-image">
                    <ProductImage product={item} />
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.nombre}</h4>
                    <span className="price">{formatPriceCOP(item.precio * item.quantity)}</span>
                    <div className="cart-item-qty">
                      <button type="button" title="Menos" onClick={() => onUpdateQty(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" title="Más" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                    </div>
                    <button type="button" className="cart-item-remove" onClick={() => onRemove(item.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 ? (
          <div className="cart-footer" id="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <strong>{formatPriceCOP(total)}</strong>
            </div>
            <button type="button" className="btn btn-whatsapp btn-block" id="checkout-whatsapp" onClick={onCheckout}>
              <WhatsAppIcon size={20} />
              Hacer pedido
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
}
