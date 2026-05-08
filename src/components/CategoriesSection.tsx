import { CATEGORIAS } from '../data/catalog';

type Props = {
  onPickCategory: (categoryId: string) => void;
};

export function CategoriesSection({ onPickCategory }: Props) {
  return (
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
              onClick={() => onPickCategory(cat.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPickCategory(cat.id);
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
  );
}
