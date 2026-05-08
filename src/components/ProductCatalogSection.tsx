import { CATEGORIAS, type Product } from '../data/catalog';
import { formatPriceCOP } from '../utils/formatPrice';
import { ProductImage } from './ProductImage';

type Props = {
  filter: string;
  setFilter: (id: string) => void;
  ready: boolean;
  products: Product[];
  catName: (id: string) => string;
  onOpenModal: (p: Product) => void;
  onAddToCart: (p: Product) => void;
};

export function ProductCatalogSection({
  filter,
  setFilter,
  ready,
  products,
  catName,
  onOpenModal,
  onAddToCart,
}: Props) {
  return (
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
            products.map((p) => (
              <article
                key={p.id}
                className="product-card"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('.add-cart')) return;
                  onOpenModal(p);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenModal(p);
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
                        onAddToCart(p);
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary view-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(p);
                      }}
                    >
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
  );
}
