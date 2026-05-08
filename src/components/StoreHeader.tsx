import type { Dispatch, MouseEvent, SetStateAction } from 'react';

type Props = {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  cartOpen: boolean;
  toggleCart: () => void;
  cartCount: number;
  scrollTo: (hash: string) => void;
};

export function StoreHeader({
  navOpen,
  setNavOpen,
  cartOpen,
  toggleCart,
  cartCount,
  scrollTo,
}: Props) {
  const navLink = (hash: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(hash);
  };

  return (
    <header className="header" id="header">
      <div className="header-container">
        <a href="#inicio" className="logo" onClick={navLink('#inicio')}>
          <span className="logo-icon">🎁</span>
          <span className="logo-text">RegaloMágico</span>
        </a>
        <nav className={`nav ${navOpen ? 'active' : ''}`} id="nav-principal" aria-label="Principal">
          <ul className="nav-list">
            <li>
              <a href="#inicio" onClick={navLink('#inicio')}>Inicio</a>
            </li>
            <li>
              <a href="#categorias" onClick={navLink('#categorias')}>Categorías</a>
            </li>
            <li>
              <a href="#productos" onClick={navLink('#productos')}>Productos</a>
            </li>
            <li>
              <a href="#como-funciona" onClick={navLink('#como-funciona')}>¿Cómo funciona?</a>
            </li>
            <li>
              <a href="#contacto" onClick={navLink('#contacto')}>Contacto</a>
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
            onClick={toggleCart}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-count">{cartCount}</span>
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
  );
}
