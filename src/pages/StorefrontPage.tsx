/**
 * Página única de la tienda: compone header, secciones de contenido, carrito y modal de producto.
 *
 * Datos: `useProductsCatalog` → API o `catalog.ts`. Carrito: `useCart`. Checkout: texto + WhatsApp (`whatsapp.ts`).
 */
import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { CATEGORIAS, CONFIG, type Product } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useProductsCatalog } from '../hooks/useProductsCatalog';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { formatWhatsAppOrderText, openWhatsAppWithText } from '../utils/whatsapp';
import {
  CartSidebar,
  CategoriesSection,
  ContactSection,
  HeroSection,
  HowItWorksSection,
  ProductCatalogSection,
  ProductDetailModal,
  SiteFooter,
  StoreHeader,
  WhatsAppFloatButton,
} from '../components';

export function StorefrontPage() {
  const { products, ready } = useProductsCatalog();
  const { items, add, remove, updateQty, clear, total, count } = useCart();

  const [filter, setFilter] = useState<string>('todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'todos') return products;
    return products.filter((product) => product.categoria === filter);
  }, [products, filter]);

  const scrollTo = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen((open: boolean) => !open), []);

  const openModal = useCallback((p: Product) => setModalProduct(p), []);
  const closeModal = useCallback(() => setModalProduct(null), []);

  useBodyScrollLock(cartOpen || modalProduct !== null);

  const closeOverlays = useCallback(() => {
    closeModal();
    closeCart();
  }, [closeModal, closeCart]);

  useEscapeKey(closeOverlays, cartOpen || modalProduct !== null);

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

  const handleAddToCartAndOpen = useCallback(
    (p: Product) => {
      add(p);
      openCart();
    },
    [add, openCart],
  );

  const handleModalAdd = useCallback(() => {
    if (!modalProduct) return;
    add(modalProduct);
    closeModal();
    openCart();
  }, [modalProduct, add, closeModal, openCart]);

  return (
    <>
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>

      <WhatsAppFloatButton whatsappHref={CONFIG.whatsappLink} onClick={onWhatsAppFloat} />

      <StoreHeader
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        cartOpen={cartOpen}
        toggleCart={toggleCart}
        cartCount={count}
        scrollTo={scrollTo}
      />

      <main id="contenido-principal">
        <HeroSection onExploreProducts={() => scrollTo('#productos')} />

        <CategoriesSection
          onPickCategory={(catId) => {
            setFilter(catId);
            scrollTo('#productos');
          }}
        />

        <ProductCatalogSection
          filter={filter}
          setFilter={setFilter}
          ready={ready}
          products={filtered}
          catName={catName}
          onOpenModal={openModal}
          onAddToCart={handleAddToCartAndOpen}
        />

        <HowItWorksSection />

        <ContactSection
          onWhatsAppClick={(e) => {
            e.preventDefault();
            openWhatsAppWithText(formatWhatsAppOrderText([], 0), { orderFlow: false });
          }}
        />
      </main>

      <SiteFooter />

      <CartSidebar
        open={cartOpen}
        onClose={closeCart}
        items={items}
        total={total}
        onUpdateQty={updateQty}
        onRemove={remove}
        onCheckout={onCheckout}
        onBrowseProducts={() => scrollTo('#productos')}
      />

      {modalProduct ? (
        <ProductDetailModal
          product={modalProduct}
          categoryLabel={catName(modalProduct.categoria)}
          onClose={closeModal}
          onAddToCart={handleModalAdd}
        />
      ) : null}
    </>
  );
}
