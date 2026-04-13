/**
 * RegaloMágico - Carrito de compras
 */

const Cart = {
  items: [],
  storageKey: 'regalomagico_cart',

  // Inicializa el carrito:
  // - carga items desde localStorage
  // - renderiza el contador en el header
  // - engancha eventos (abrir/cerrar sidebar)
  init() {
    this.load();
    this.renderCount();
    this.bindEvents();
  },

  // Lee el carrito desde localStorage.
  // Si el JSON no existe o está corrupto, inicializa una lista vacía.
  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.items = saved ? JSON.parse(saved) : [];
    } catch (e) {
      this.items = [];
    }
  },

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.renderCount();
  },

  // Agrega un producto al carrito o incrementa su cantidad si ya existe.
  add(product, quantity = 1) {
    const exist = this.items.find(i => String(i.id) === String(product.id));
    if (exist) exist.quantity += quantity;
    else this.items.push({ ...product, quantity });
    this.save();
    this.renderSidebar();
  },

  remove(id) {
    this.items = this.items.filter(i => String(i.id) !== String(id));
    this.save();
    this.renderSidebar();
  },

  // Ajusta la cantidad de un producto.
  // `delta` puede ser +1 (más) o -1 (menos). Nunca deja quantity < 1.
  updateQty(id, delta) {
    const item = this.items.find(i => String(i.id) === String(id));
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    this.save();
    this.renderSidebar();
  },

  // Suma precio * cantidad para todos los items del carrito.
  getTotal() {
    return this.items.reduce((sum, i) => sum + i.precio * i.quantity, 0);
  },

  // Limpia el carrito completo.
  clear() {
    this.items = [];
    this.save();
    this.renderSidebar();
  },

  // Actualiza el contador del carrito en el header (`cart-count`).
  renderCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = this.items.reduce((s, i) => s + i.quantity, 0);
  },

  // Renderiza el sidebar del carrito:
  // - muestra vacío si no hay items
  // - muestra lista de items con botones (menos/más/eliminar)
  // - engancha listeners para esos botones
  renderSidebar() {
    const empty = document.getElementById('cart-empty');
    const items = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const total = document.getElementById('cart-total');

    if (this.items.length === 0) {
      if (empty) empty.style.display = 'block';
      if (items) items.innerHTML = '';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (empty) empty.style.display = 'none';
    if (footer) footer.style.display = 'block';
    if (total) total.textContent = '$' + this.getTotal().toLocaleString('es-CO');

    if (items) {
      items.innerHTML = this.items.map(item => {
        const imgSrc = item.fotos && item.fotos[0] ? encodeURI(item.fotos[0]) : '';
        const img = imgSrc ? `<img src="${imgSrc}" alt="${(item.nombre || '').replace(/"/g, '&quot;')}">` : (item.emoji || '🎁');
        return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-image">${img}</div>
          <div class="cart-item-info">
            <h4>${item.nombre}</h4>
            <span class="price">$${(item.precio * item.quantity).toLocaleString('es-CO')}</span>
            <div class="cart-item-qty">
              <button type="button" data-action="minus" title="Menos">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="plus" title="Más">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-action="remove">Eliminar</button>
          </div>
        </div>
      `;}).join('');

      items.querySelectorAll('.cart-item').forEach(row => {
        const id = row.dataset.id;
        row.querySelector('[data-action="minus"]')?.addEventListener('click', () => this.updateQty(id, -1));
        row.querySelector('[data-action="plus"]')?.addEventListener('click', () => this.updateQty(id, 1));
        row.querySelector('[data-action="remove"]')?.addEventListener('click', () => this.remove(id));
      });
    }
  },

  // Conecta eventos para abrir/cerrar el carrito.
  bindEvents() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    const openBtn = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('cart-close');

    const open = () => {
      this.renderSidebar();
      overlay?.classList.add('active');
      sidebar?.classList.add('active');
      document.body.style.overflow = 'hidden';
      openBtn?.setAttribute('aria-expanded', 'true');
      overlay?.setAttribute('aria-hidden', 'false');
      sidebar?.setAttribute('aria-hidden', 'false');
    };
    const close = () => {
      overlay?.classList.remove('active');
      sidebar?.classList.remove('active');
      document.body.style.overflow = '';
      openBtn?.setAttribute('aria-expanded', 'false');
      overlay?.setAttribute('aria-hidden', 'true');
      sidebar?.setAttribute('aria-hidden', 'true');
    };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
  }
};
