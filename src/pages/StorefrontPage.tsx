import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import { CATEGORIAS, CONFIG, type Product } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useProductsCatalog } from '../hooks/useProductsCatalog';
import { formatPriceCOP } from '../utils/formatPrice';
import { publicUrl } from '../utils/publicUrl';
import { formatWhatsAppOrderText, openWhatsAppWithText } from '../utils/whatsapp';

function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const [broken, setBroken] = useState(false);
  const src = product.fotos?.[0] ? publicUrl(product.fotos[0]) : '';
  if (!src || broken) {
    return <span className={`img-fallback ${className}`.trim()}>{product.emoji || '🎁'}</span>;
  }
  return (
    <img
      className={className}
      src={src}
      alt={product.nombre || ''}
      onError={() => setBroken(true)}
    />
  );
}

export function StorefrontPage() {
  const { products, ready } = useProductsCatalog();
  const { items, add, remove, updateQty, clear, total, count } = useCart();

  const [filter, setFilter] = useState<string>('todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'todos') return products;
    return products.filter((p) => p.categoria === filter);
  }, [products, filter]);

  const scrollTo = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setCartOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
    document.body.style.overflow = '';
  }, []);

  const openModal = useCallback((p: Product) => {
    setModalProduct(p);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setModalProduct(null);
    if (!cartOpen) document.body.style.overflow = '';
  }, [cartOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        closeCart();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal, closeCart]);

  const onWhatsAppFloat = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const orderFlow = items.length > 0;
    openWhatsAppWithText(formatWhatsAppOrderText(orderFlow ? items : [], total), { orderFlow });
  };

  const onCheckout = () => {
    if (items.length === 0) return;
    openWhatsAppWithText(formatWhatsAppOrderText(items, total), { orderFlow: true });
    clear();
    closeCart();
  };

  const catName = (id: string) => CATEGORIAS.find((c) => c.id === id)?.nombre || id;

  return (
    <>
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>

      <a
        href={CONFIG.whatsappLink}
        className="whatsapp-float"
        id="whatsapp-float"
        aria-label="Contactar por WhatsApp"
        onClick={onWhatsAppFloat}
      >
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden>
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.82.738 5.5 2.028 7.825L.472 30.852l7.225-1.898A15.9 15.9 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333a13.26 13.26 0 01-7.062-2.02l-.507-.3-5.26 1.383 1.408-5.128-.332-.526A13.214 13.214 0 012.667 16c0-7.364 5.97-13.333 13.333-13.333S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.272-9.88c-.393-.198-2.322-1.146-2.682-1.275-.36-.13-.622-.198-.884.198-.261.396-1.016 1.275-1.245 1.537-.23.261-.46.295-.853.098-.393-.198-1.659-.612-3.16-1.95-1.169-1.041-1.957-2.327-2.186-2.723-.23-.396-.025-.61.173-.806.177-.177.393-.46.59-.69.197-.23.262-.393.393-.655.131-.262.066-.492-.033-.69-.098-.197-.884-2.13-1.212-2.916-.319-.765-.643-.66-.884-.673l-.754-.015a1.445 1.445 0 00-1.048.492c-.36.393-1.376 1.345-1.376 3.282 0 1.937 1.412 3.807 1.608 4.07.197.262 2.776 4.237 6.727 5.837.94.38 1.674.607 2.245.777.94.279 1.798.239 2.475.145.758-.104 2.322-.949 2.648-1.866.327-.918.327-1.705.23-1.866-.098-.162-.36-.262-.753-.46z" />
        </svg>
        <span>Pedir por WhatsApp</span>
      </a>

      <header className="header" id="header">
        <div className="header-container">
          <a href="#inicio" className="logo" onClick={(e) => { e.preventDefault(); scrollTo('#inicio'); }}>
            <span className="logo-icon">🎁</span>
            <span className="logo-text">RegaloMágico</span>
          </a>
          <nav className={`nav ${navOpen ? 'active' : ''}`} id="nav-principal" aria-label="Principal">
            <ul className="nav-list">
              <li>
                <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('#inicio'); }}>Inicio</a>
              </li>
              <li>
                <a href="#categorias" onClick={(e) => { e.preventDefault(); scrollTo('#categorias'); }}>Categorías</a>
              </li>
              <li>
                <a href="#productos" onClick={(e) => { e.preventDefault(); scrollTo('#productos'); }}>Productos</a>
              </li>
              <li>
                <a href="#como-funciona" onClick={(e) => { e.preventDefault(); scrollTo('#como-funciona'); }}>¿Cómo funciona?</a>
              </li>
              <li>
                <a href="#contacto" onClick={(e) => { e.preventDefault(); scrollTo('#contacto'); }}>Contacto</a>
              </li>
              <li>
                <a href="/admin.html" className="nav-admin">Admin</a>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="cart-btn"
              aria-label="Ver carrito"
              aria-expanded={cartOpen}
              aria-controls="cart-sidebar"
              onClick={() => (cartOpen ? closeCart() : openCart())}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="cart-count">{count}</span>
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Abrir o cerrar menú"
              aria-expanded={navOpen}
              aria-controls="nav-principal"
              onClick={() => setNavOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="contenido-principal">
        <section className="hero" id="inicio">
          <div className="hero-bg">
            <div className="hero-gradient" />
            <div className="hero-pattern" />
            <div className="hero-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
            </div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">Encuentra el regalo perfecto</h1>
            <p className="hero-subtitle">
              Selecciona, personaliza y compra por WhatsApp. Sin pasarelas de pago, rápido y seguro.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => scrollTo('#productos')}>
              Explorar regalos
            </button>
          </div>
        </section>

        <section className="section categories" id="categorias">
          <div className="container">
            <h2 className="section-title">Categorías</h2>
            <div className="categories-grid">
              {CATEGORIAS.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setFilter(cat.id);
                    scrollTo('#productos');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFilter(cat.id);
                      scrollTo('#productos');
                    }
                  }}
                >
                  <span className="icon">{cat.icono}</span>
                  <h3>{cat.nombre}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section products" id="productos">
          <div className="container">
            <h2 className="section-title">Productos destacados</h2>
            <div className="products-filter" role="group" aria-label="Filtrar por categoría">
              <button
                type="button"
                className={`filter-btn${filter === 'todos' ? ' active' : ''}`}
                onClick={() => setFilter('todos')}
              >
                Todos
              </button>
              {CATEGORIAS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`filter-btn${filter === c.id ? ' active' : ''}`}
                  onClick={() => setFilter(c.id)}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
            <div className="products-grid">
              {!ready ? (
                <p className="section-title" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                  Cargando catálogo…
                </p>
              ) : (
                filtered.map((p) => (
                  <article
                    key={p.id}
                    className="product-card"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('.add-cart')) return;
                      openModal(p);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(p);
                      }
                    }}
                  >
                    <div className={`product-image ${p.fotos?.length ? 'has-img' : ''}`}>
                      <ProductImage product={p} />
                    </div>
                    <div className="product-info">
                      <h3>{p.nombre}</h3>
                      <span className="category">{catName(p.categoria)}</span>
                      <p className="price">{formatPriceCOP(p.precio)}</p>
                      <div className="product-actions">
                        <button
                          type="button"
                          className="btn btn-outline add-cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            add(p);
                            openCart();
                          }}
                        >
                          Agregar
                        </button>
                        <button type="button" className="btn btn-primary view-detail" onClick={(e) => { e.stopPropagation(); openModal(p); }}>
                          Ver más
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section how-it-works" id="como-funciona">
          <div className="container">
            <h2 className="section-title">¿Cómo comprar?</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Elige tu regalo</h3>
                <p>Explora nuestro catálogo y añade los productos que te gusten al carrito.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Revisa tu pedido</h3>
                <p>Revisa los productos seleccionados y añade datos de envío si aplica.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Hacer pedido</h3>
                <p>
                  Usa «Hacer pedido» en el carrito para enviar tu lista por WhatsApp. Te confirmamos disponibilidad y
                  pago.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section contact" id="contacto">
          <div className="container">
            <h2 className="section-title">Contacto</h2>
            <div className="contact-content">
              <div className="contact-info">
                <p><strong>¿Dudas? ¿Productos personalizados?</strong></p>
                <p>Escríbenos por WhatsApp, estamos para ayudarte.</p>
                <a
                  href={CONFIG.whatsappLink}
                  className="btn btn-whatsapp"
                  id="contact-whatsapp"
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsAppWithText(formatWhatsAppOrderText([], 0), { orderFlow: false });
                  }}
                >
                  <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M16 0C7.164 0 0 7.164 0 16c0 2.82.738 5.5 2.028 7.825L.472 30.852l7.225-1.898A15.9 15.9 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0z"
                    />
                  </svg>
                  Chatear por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">🎁</span> RegaloMágico
            </div>
            <p className="footer-text">Tienda virtual de regalos • Compra por WhatsApp</p>
            <p className="footer-copy">© 2026 RegaloMágico. Todos los derechos reservados.</p>
            <p className="footer-admin">
              <a href="/admin.html">Administración</a>
            </p>
          </div>
        </div>
      </footer>

      <div
        className={`cart-overlay${cartOpen ? ' active' : ''}`}
        aria-hidden={!cartOpen}
        onClick={closeCart}
      />
      <aside
        className={`cart-sidebar${cartOpen ? ' active' : ''}`}
        id="cart-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!cartOpen}
      >
        <div className="cart-header">
          <h2 id="cart-title">Tu carrito</h2>
          <button type="button" className="cart-close" aria-label="Cerrar carrito" onClick={closeCart}>
            &times;
          </button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty" id="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>Tu carrito está vacío</p>
              <button type="button" className="btn btn-outline" onClick={() => { closeCart(); scrollTo('#productos'); }}>
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
                      <button type="button" title="Menos" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" title="Más" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                    <button type="button" className="cart-item-remove" onClick={() => remove(item.id)}>
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
              <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden>
                <path
                  fill="currentColor"
                  d="M16 0C7.164 0 0 7.164 0 16c0 2.82.738 5.5 2.028 7.825L.472 30.852l7.225-1.898A15.9 15.9 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0z"
                />
              </svg>
              Hacer pedido
            </button>
          </div>
        ) : null}
      </aside>

      <div
        className={`modal-overlay${modalProduct ? ' active' : ''}`}
        id="product-modal-overlay"
        aria-hidden={!modalProduct}
        onClick={closeModal}
      />
      {modalProduct ? (
        <div
          className="modal active"
          id="product-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
          aria-hidden="false"
        >
          <button type="button" className="modal-close" aria-label="Cerrar detalle" onClick={closeModal}>
            &times;
          </button>
          <div className="modal-content" id="modal-content">
            {modalProduct.fotos?.length ? (
              <div className="modal-gallery">
                <img src={publicUrl(modalProduct.fotos[0])} alt={modalProduct.nombre || ''} />
                {modalProduct.fotos.length > 1 ? (
                  <span className="gallery-count">+{modalProduct.fotos.length - 1}</span>
                ) : null}
              </div>
            ) : (
              <div className="modal-product-image">{modalProduct.emoji || '🎁'}</div>
            )}
            <div className="modal-product-info">
              <h2 id="modal-product-title">{modalProduct.nombre}</h2>
              <span className="modal-price">{formatPriceCOP(modalProduct.precio)}</span>
              <p className="category">{catName(modalProduct.categoria)}</p>
              <div className="modal-desc">
                {[modalProduct.contenido, modalProduct.descripcion].filter(Boolean).join('\n\n')}
              </div>
              <button
                type="button"
                className="btn btn-whatsapp btn-block add-from-modal"
                onClick={() => {
                  add(modalProduct);
                  closeModal();
                  openCart();
                }}
              >
                <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M16 0C7.164 0 0 7.164 0 16c0 2.82.738 5.5 2.028 7.825L.472 30.852l7.225-1.898A15.9 15.9 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0z"
                  />
                </svg>
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
