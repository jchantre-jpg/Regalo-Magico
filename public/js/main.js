/**
 * RegaloMágico - Tienda virtual de regalos
 * Compra por WhatsApp sin pasarela de pagos
 */

let PRODUCTOS_ACTUAL = [];

// Al cargar la página:
// - inicializamos carrito
// - renderizamos categorías
// - cargamos productos (API o local)
// - conectamos filtros, navegación, modal y WhatsApp
document.addEventListener('DOMContentLoaded', async () => {
  Cart.init();
  renderCategories();
  await loadProducts();
  renderFilterButtons();
  bindNav();
  bindWhatsApp();
  bindProductModal();
  bindMenuToggle();
});

// Carga el listado de productos desde la fuente configurada (getProducts()).
// Si falla por red o si viene vacío, hace fallback al catálogo estático `PRODUCTOS`.
async function loadProducts() {
  try {
    let list = await getProducts();
    if (!list || list.length === 0) {
      list = PRODUCTOS.map((p, i) => ({ ...p, id: p.id || i + 1 }));
    }
    PRODUCTOS_ACTUAL = list;
  } catch (e) {
    console.warn('Error cargando productos:', e);
    PRODUCTOS_ACTUAL = PRODUCTOS.map((p, i) => ({ ...p, id: p.id || i + 1 }));
  }
  renderProducts();
}

// Categorías
// Genera la grilla de categorías y engancha clics para filtrar productos.
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(cat => `
    <div class="category-card" data-filter="${cat.id}">
      <span class="icon">${cat.icono}</span>
      <h3>${cat.nombre}</h3>
    </div>
  `).join('');

  grid.querySelectorAll('.category-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    const activate = () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      const btn = document.querySelector(`.filter-btn[data-filter="${card.dataset.filter}"]`);
      if (btn) btn.classList.add('active');
      filterProducts(card.dataset.filter);
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

// Filtros
// Renderiza botones “Todos + categorías” y al hacer clic actualiza el listado.
function renderFilterButtons() {
  const container = document.getElementById('products-filter');
  if (!container) return;
  const btns =
    '<button type="button" class="filter-btn active" data-filter="todos">Todos</button>' +
    CATEGORIAS.map(
      c => `<button type="button" class="filter-btn" data-filter="${c.id}">${c.nombre}</button>`
    ).join('');
  container.innerHTML = btns;

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');
      filterProducts(btn.dataset.filter);
    });
  });
}

// Productos
// Renderiza las tarjetas de productos (con imagen/emoji, precio y botones).
// `filter` controla si se muestran todos o solo una categoría.
function renderProducts(filter = 'todos') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const list = filter === 'todos' ? PRODUCTOS_ACTUAL : PRODUCTOS_ACTUAL.filter(p => p.categoria === filter);

  const getProductImg = (p) => {
    const fallback = (p.emoji || '🎁').replace(/"/g, '&quot;');
    if (p.fotos && p.fotos.length > 0) {
      const src = encodeURI(p.fotos[0]);
      return `<img src="${src}" alt="${(p.nombre || '').replace(/"/g, '&quot;')}" data-fallback="${fallback}" onerror="this.outerHTML='<span class=img-fallback>'+this.dataset.fallback+'</span>'">`;
    }
    return fallback;
  };

  grid.innerHTML = list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image ${p.fotos && p.fotos.length ? 'has-img' : ''}">${getProductImg(p)}</div>
      <div class="product-info">
        <h3>${p.nombre}</h3>
        <span class="category">${CATEGORIAS.find(c => c.id === p.categoria)?.nombre || p.categoria}</span>
        <p class="price">$${(p.precio || 0).toLocaleString('es-CO')}</p>
        <div class="product-actions">
          <button type="button" class="btn btn-outline add-cart" data-id="${p.id}">Agregar</button>
          <button type="button" class="btn btn-primary view-detail" data-id="${p.id}">Ver más</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const prod = PRODUCTOS_ACTUAL.find(p => String(p.id) === String(id));
      if (prod) Cart.add(prod);
      document.getElementById('cart-btn')?.click();
    });
  });

  grid.querySelectorAll('.view-detail, .product-card').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.add-cart')) return;
      const card = e.target.closest('.product-card');
      if (card) openProductModal(card.dataset.id);
    });
  });
}

// Cambia el filtro y vuelve a renderizar.
function filterProducts(filter) {
  renderProducts(filter);
}

// Modal producto
// Conecta los eventos del modal: cerrar por botón, por overlay y Escape.
function bindProductModal() {
  const overlay = document.getElementById('product-modal-overlay');
  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');

  const close = () => {
    overlay?.classList.remove('active');
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

// Abre el modal con la información del producto seleccionado.
// Renderiza fotos/emoji y arma la sección de detalle.
function openProductModal(id) {
  const p = PRODUCTOS_ACTUAL.find(pr => String(pr.id) === String(id));
  if (!p) return;
  const cat = CATEGORIAS.find(c => c.id === p.categoria);
  const content = document.getElementById('modal-content');
  const modal = document.getElementById('product-modal');
  const overlay = document.getElementById('product-modal-overlay');

  const imgSrc = p.fotos && p.fotos.length > 0 ? encodeURI(p.fotos[0]) : '';
  const imgContent = p.fotos && p.fotos.length > 0
    ? `<div class="modal-gallery"><img src="${imgSrc}" alt="${(p.nombre || '').replace(/"/g, '&quot;')}">${p.fotos.length > 1 ? `<span class="gallery-count">+${p.fotos.length - 1}</span>` : ''}</div>`
    : `<div class="modal-product-image">${p.emoji || '🎁'}</div>`;

  const fullDesc = [p.contenido, p.descripcion].filter(Boolean).join('\n\n');

  content.innerHTML = `
    ${imgContent}
    <div class="modal-product-info">
      <h2 id="modal-product-title">${p.nombre}</h2>
      <span class="modal-price">$${(p.precio || 0).toLocaleString('es-CO')}</span>
      <p class="category">${cat?.nombre || p.categoria}</p>
      <div class="modal-desc">${fullDesc ? fullDesc.replace(/\n/g, '<br>') : ''}</div>
      <button type="button" class="btn btn-whatsapp btn-block add-from-modal" data-id="${p.id}">
        <svg viewBox="0 0 32 32" width="20" height="20"><path fill="currentColor" d="M16 0C7.164 0 0 7.164 0 16c0 2.82.738 5.5 2.028 7.825L.472 30.852l7.225-1.898A15.9 15.9 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0z"/></svg>
        Agregar al carrito
      </button>
    </div>
  `;

  content.querySelector('.add-from-modal')?.addEventListener('click', () => {
    Cart.add(p);
    overlay?.classList.remove('active');
    modal?.classList.remove('active');
    document.getElementById('cart-btn')?.click();
  });

  modal?.setAttribute('aria-hidden', 'false');
  overlay?.setAttribute('aria-hidden', 'false');
  overlay?.classList.add('active');
  modal?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Texto del pedido o mensaje genérico de contacto (según ítems del carrito).
function formatWhatsAppOrderText(items) {
  if (items && items.length > 0) {
    let text = CONFIG.orderMessage + '\n\n*Productos que seleccioné:*\n';
    items.forEach(i => {
      text += `• ${i.nombre} x${i.quantity} — $${(i.precio * i.quantity).toLocaleString('es-CO')}\n`;
    });
    text += `\n*Total: $${Cart.getTotal().toLocaleString('es-CO')}*`;
    return text;
  }
  return '¡Hola! Me gustaría información sobre los productos de RegaloMágico.';
}

// Número en <body data-whatsapp="57..."> (siempre llega aunque products.js esté en caché vieja).
function getWhatsAppPhoneDigits() {
  const fromDom = (document.body?.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
  if (fromDom) return fromDom;
  const fromConfig = (typeof CONFIG !== 'undefined' && CONFIG.whatsappNumber
    ? String(CONFIG.whatsappNumber)
    : ''
  ).replace(/\D/g, '');
  if (fromConfig) return fromConfig;
  const link = typeof CONFIG !== 'undefined' && CONFIG.whatsappLink ? String(CONFIG.whatsappLink) : '';
  const m = link.match(/[?&]phone=(\d+)/i);
  return m ? m[1].replace(/\D/g, '') : '';
}

function isWhatsAppQrLink(link) {
  return /wa\.me\/qr\//i.test(link) || /api\.whatsapp\.com\/.*\/qr\//i.test(link);
}

function showWhatsAppToast(message) {
  let el = document.getElementById('whatsapp-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'whatsapp-toast';
    el.setAttribute('role', 'status');
    el.style.cssText =
      'position:fixed;bottom:96px;left:50%;transform:translateX(-50%);' +
      'background:#1a3328;color:#fff;padding:14px 20px;border-radius:12px;' +
      'z-index:10001;max-width:min(420px,92vw);font-size:14px;line-height:1.4;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.28);text-align:center;';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.display = 'block';
  clearTimeout(showWhatsAppToast._t);
  showWhatsAppToast._t = setTimeout(() => {
    el.style.display = 'none';
  }, 6000);
}

// Abre el chat por número (nunca enlaces /qr/ en PC: WhatsApp muestra “instala la app” aunque ya la tengas).
async function openWhatsAppWithText(message, options = {}) {
  const { orderFlow = false } = options;
  const link = typeof CONFIG !== 'undefined' && CONFIG.whatsappLink ? CONFIG.whatsappLink : '';
  const num = getWhatsAppPhoneDigits();

  if (num) {
    const sendUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(message)}`;
    window.open(sendUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  if (link && !isWhatsAppQrLink(link)) {
    const sep = link.includes('?') ? '&' : '?';
    window.open(`${link}${sep}text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    return;
  }

  if (link && isWhatsAppQrLink(link)) {
    if (orderFlow) {
      try {
        await navigator.clipboard.writeText(message);
        showWhatsAppToast(
          'Pedido copiado. En PC el link QR de WhatsApp falla: abre web.whatsapp.com y pega el mensaje.'
        );
      } catch (_) {
        showWhatsAppToast('Copia el pedido a mano y envíalo por WhatsApp Web o el móvil.');
      }
    } else {
      showWhatsAppToast('En computador evita el enlace QR; usa WhatsApp Web o un link con tu número.');
    }
    return;
  }

  window.open('https://api.whatsapp.com/send?phone=573143562274', '_blank', 'noopener,noreferrer');
}

// Conecta botones para:
// - WhatsApp flotante
// - botón de contacto
// - botón de checkout en el carrito
function bindWhatsApp() {
  const floatBtn = document.getElementById('whatsapp-float');
  const contactBtn = document.getElementById('contact-whatsapp');
  const checkoutBtn = document.getElementById('checkout-whatsapp');

  floatBtn?.addEventListener('click', e => {
    e.preventDefault();
    const items = Cart.items;
    const orderFlow = items.length > 0;
    openWhatsAppWithText(formatWhatsAppOrderText(orderFlow ? items : []), { orderFlow });
  });

  contactBtn?.addEventListener('click', e => {
    e.preventDefault();
    openWhatsAppWithText(formatWhatsAppOrderText([]), { orderFlow: false });
  });

  checkoutBtn?.addEventListener('click', () => {
    if (Cart.items.length === 0) return;
    openWhatsAppWithText(formatWhatsAppOrderText(Cart.items), { orderFlow: true });
    Cart.clear();
    document.getElementById('cart-overlay')?.click();
  });
}

// Navegación suave
// Hace scroll suave para links internos tipo `href="#seccion"`.
function bindNav() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        document.querySelector('.nav')?.classList.remove('active');
      }
    });
  });
}

// Menú móvil
// Alterna clase `active` en la navegación móvil cuando se presiona el botón hamburguesa.
function bindMenuToggle() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('active');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}
