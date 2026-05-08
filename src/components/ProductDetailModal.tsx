import type { Product } from '../data/catalog';
import { formatPriceCOP } from '../utils/formatPrice';
import { publicUrl } from '../utils/publicUrl';
import { WhatsAppIcon } from './WhatsAppIcon';

type Props = {
  product: Product;
  categoryLabel: string;
  onClose: () => void;
  onAddToCart: () => void;
};

export function ProductDetailModal({ product, categoryLabel, onClose, onAddToCart }: Props) {
  return (
    <>
      <div
        className="modal-overlay active"
        id="product-modal-overlay"
        aria-hidden={false}
        onClick={onClose}
      />
      <div
        className="modal active"
        id="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
        aria-hidden={false}
      >
        <button type="button" className="modal-close" aria-label="Cerrar detalle" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content" id="modal-content">
          {product.fotos?.length ? (
            <div className="modal-gallery">
              <img src={publicUrl(product.fotos[0])} alt={product.nombre || ''} />
              {product.fotos.length > 1 ? (
                <span className="gallery-count">+{product.fotos.length - 1}</span>
              ) : null}
            </div>
          ) : (
            <div className="modal-product-image">{product.emoji || '🎁'}</div>
          )}
          <div className="modal-product-info">
            <h2 id="modal-product-title">{product.nombre}</h2>
            <span className="modal-price">{formatPriceCOP(product.precio)}</span>
            <p className="category">{categoryLabel}</p>
            <div className="modal-desc" style={{ whiteSpace: 'pre-line' }}>
              {[product.contenido, product.descripcion].filter(Boolean).join('\n\n')}
            </div>
            <button type="button" className="btn btn-whatsapp btn-block add-from-modal" onClick={onAddToCart}>
              <WhatsAppIcon size={20} />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
