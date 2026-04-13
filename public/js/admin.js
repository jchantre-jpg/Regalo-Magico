/**
 * RegaloMágico - Panel de administración
 *
 * Este script controla:
 * - login de admin (usuario/contraseña)
 * - almacenamiento del token JWT en `sessionStorage`
 * - render del panel (lista de productos)
 * - CRUD de productos vía `products-store.js`
 */

// Keys usadas en sessionStorage (para “persistir” el login mientras esté abierta la pestaña).
const ADMIN_SESSION_KEY = 'regalomagico_admin_session';
const ADMIN_TOKEN_KEY = 'regalomagico_admin_token';

// Estado del modal de producto:
// - `productImages`: lista de imágenes seleccionadas (puede incluir URLs existentes)
// - `editingId`: id del producto que se está editando (null => crear nuevo)
let productImages = [];
let editingId = null;

// Al cargar el DOM, decidimos si mostramos login o directamente el panel.
document.addEventListener('DOMContentLoaded', () => {
  if (!checkLogin()) {
    showLogin();
  } else {
    showAdminPanel();
    initAdmin();
  }
});

// Consideramos “login válido” si:
// - la flag sessionStorage está en 'true'
// - y existe token JWT
function checkLogin() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' &&
    !!sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

// Muestra la pantalla de login y engancha el submit.
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// Ejecuta login llamando al backend:
// POST `${API_BASE_URL}/admin/login`.
// Si funciona:
// - guarda token en sessionStorage
// - oculta login y muestra panel
async function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('login-usuario').value.trim();
  const pass = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  try {
    // Asegura que `API_BASE_URL` apunte al puerto correcto (8081 o 8080).
    // Esto evita el problema de “login no funciona” cuando Docker/no-Docker usan distintos puertos.
    if (typeof apiBaseUrlReady !== 'undefined') await apiBaseUrlReady;

    // Backend devuelve: { token, usuario }
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: user, password: pass })
    });
    if (!res.ok) {
      throw new Error('Credenciales inválidas');
    }
    const data = await res.json();
    // Token JWT se usa luego en productos-store.js para llamar endpoints “solo admin”.
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    errorEl.style.display = 'none';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'flex';
    initAdmin();
  } catch (err) {
    errorEl.style.display = 'block';
    // Mostramos un error más útil para depurar:
    // - si es TypeError/Failed to fetch => problema de conexión al backend/BD
    // - si es 401 => credenciales (o DB sin admin_usuarios)
    const msg = err && err.message ? err.message : 'Error al iniciar sesión';
    errorEl.textContent = `No se pudo iniciar sesión: ${msg}. Backend: ${API_BASE_URL}`;
    // También dejamos un log para ver el detalle en la consola.
    // eslint-disable-next-line no-console
    console.error('Admin login error:', err);
  }
}

function logout() {
  // Limpia sesión (flag + token)
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('login-usuario').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').style.display = 'none';
}

// Muestra el panel de administración y engancha logout.
function showAdminPanel() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'flex';
  document.getElementById('btn-logout').addEventListener('click', logout);
}

// Inicializa la UI del admin:
// - muestra un notice según USE_API
// - carga productos
// - engancha eventos (CRUD)
async function initAdmin() {
  const notice = document.getElementById('data-notice');
  const useApi = typeof USE_API !== 'undefined' && USE_API;
  if (notice) {
    notice.innerHTML = useApi
      ? '<strong>Modo API:</strong> Productos desde el backend (SQL/Postgres).'
      : '<strong>Modo local:</strong> Productos en tu navegador (localStorage).';
    notice.style.display = 'block';
  }
  // Deja visible el botón “Nuevo producto”.
  document.getElementById('btn-new-product').style.display = 'inline-block';
  await loadProducts();
  bindEvents();
}

// Obtiene productos (API SQL o localStorage) y los renderiza.
async function loadProducts() {
  const list = document.getElementById('products-list');
  list.innerHTML = '<div class="loading">Cargando productos...</div>';
  try {
    const products = await getProducts();
    if (products.length === 0) {
      list.innerHTML = '<div class="empty-state"><p>No hay productos. Haz clic en "Nuevo producto" para agregar el primero.</p></div>';
      return;
    }
    list.innerHTML = products.map(p => renderProductCard(p)).join('');
  } catch (e) {
    list.innerHTML = `<div class="notice notice-warning">Error al cargar: ${e.message}</div>`;
  }
}

// Renderiza una “tarjeta” por cada producto con botones de editar/eliminar.
function renderProductCard(p) {
  const fotos = p.fotos && p.fotos.length > 0 ? p.fotos : [];
  const imgContent = fotos[0]
    ? `<img src="${encodeURI(fotos[0])}" alt="${(p.nombre || '').replace(/"/g, '&quot;')}">`
    : `<span class="placeholder">${CATEGORIAS.find(c => c.id === p.categoria)?.icono || '🎁'}</span>`;
  return `
    <div class="admin-product-card" data-id="${p.id}">
      <div class="img-wrap">${imgContent}</div>
      <div class="body">
        <h3>${p.nombre}</h3>
        <p class="meta">$${(p.precio || 0).toLocaleString('es-CO')} • Stock: ${p.cantidad ?? 1}</p>
        <div class="actions">
          <button class="btn btn-primary btn-sm btn-edit" data-id="${p.id}">Editar</button>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${p.id}">Eliminar</button>
        </div>
      </div>
    </div>
  `;
}

// Conecta eventos DOM del admin: clics, submit del form, botones de modal, etc.
function bindEvents() {
  const btnNew = document.getElementById('btn-new-product');
  if (btnNew) btnNew.addEventListener('click', () => openModal());
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('product-modal-overlay').addEventListener('click', closeModal);
  document.getElementById('product-form').addEventListener('submit', handleSubmit);

  document.getElementById('image-upload-area').addEventListener('click', () => document.getElementById('product-images').click());
  document.getElementById('product-images').addEventListener('change', handleImageSelect);

  document.getElementById('products-list').addEventListener('click', e => {
    if (e.target.closest('.btn-edit')) {
      openModal(e.target.closest('.btn-edit').dataset.id);
    } else if (e.target.closest('.btn-delete')) {
      handleDelete(e.target.closest('.btn-delete').dataset.id);
    }
  });
}

// Abre el modal:
// - id === null => “Nuevo producto”
// - id != null => “Editar producto” y precarga datos
function openModal(id = null) {
  editingId = id;
  document.getElementById('modal-title').textContent = id ? 'Editar producto' : 'Nuevo producto';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = id || '';
  productImages = [];

  if (id) {
    // Si editamos, buscamos el producto actual para precargar campos.
    getProducts().then(products => {
      const p = products.find(pr => pr.id === id);
      if (p) {
        document.getElementById('product-name').value = p.nombre;
        document.getElementById('product-category').value = p.categoria;
        document.getElementById('product-price').value = p.precio;
        document.getElementById('product-stock').value = p.cantidad ?? 1;
        document.getElementById('product-contenido').value = p.contenido || '';
        document.getElementById('product-desc').value = p.descripcion || '';
        if (p.fotos && p.fotos.length > 0) {
          productImages = p.fotos.map(url => ({ url, file: null }));
          renderImagePreview();
        }
      }
    });
  } else {
    // Si creamos, limpiamos preview.
    document.getElementById('image-preview').innerHTML = '';
  }

  document.getElementById('product-modal-overlay').classList.add('active');
}

// Cierra modal y limpia estado interno.
function closeModal() {
  document.getElementById('product-modal-overlay').classList.remove('active');
  editingId = null;
  productImages = [];
}

// Toma los archivos seleccionados (máx 5) y los guarda en `productImages`.
function handleImageSelect(e) {
  const files = Array.from(e.target.files || []);
  const allowed = files.slice(0, 5);
  allowed.forEach(f => {
    if (f.type.startsWith('image/')) productImages.push({ file: f, url: null });
  });
  renderImagePreview();
  e.target.value = '';
}

// Renderiza miniaturas para cada imagen seleccionada.
function renderImagePreview() {
  const container = document.getElementById('image-preview');
  container.innerHTML = '';
  productImages.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'image-preview-item';
    const img = document.createElement('img');
    if (item.url) img.src = item.url;
    else img.src = URL.createObjectURL(item.file);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove';
    btn.textContent = '×';
    btn.onclick = () => {
      productImages.splice(i, 1);
      renderImagePreview();
    };
    div.appendChild(img);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

// Submit del formulario del modal:
// - arma el objeto `data`
// - si es edición, llama updateProduct
// - si es nuevo, llama addProduct
// - si hay imágenes, las convierte a “urls” y las guarda en producto.fotos
async function handleSubmit(e) {
  e.preventDefault();

  const contenido = document.getElementById('product-contenido').value.trim();
  const descripcion = document.getElementById('product-desc').value.trim();
  if (!contenido && !descripcion) {
    alert('Agrega el contenido del detalle o la descripción.');
    return;
  }

  const btn = document.getElementById('btn-save');
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  const data = {
    nombre: document.getElementById('product-name').value.trim(),
    categoria: document.getElementById('product-category').value,
    precio: parseInt(document.getElementById('product-price').value) || 0,
    cantidad: parseInt(document.getElementById('product-stock').value) || 1,
    contenido,
    descripcion
  };

  try {
    // productId existe solo si estamos editando.
    const productId = editingId || await addProduct(data);

    const filesToUpload = productImages.filter(i => i.file);
    if (filesToUpload.length > 0) {
      // Convertimos archivos local->dataURL (o el tipo que tu implementación espere).
      const urls = await uploadMultipleImages(filesToUpload.map(i => i.file), productId);
      const existingUrls = (productImages.filter(i => i.url).map(i => i.url)) || [];
      data.fotos = [...existingUrls, ...urls];
    } else if (productImages.length > 0) {
      data.fotos = productImages.map(i => i.url);
    }

    if (editingId) {
      await updateProduct(editingId, data);
    } else if (data.fotos && data.fotos.length > 0) {
      await updateProduct(productId, { fotos: data.fotos });
    }

    closeModal();
    await loadProducts();
  } catch (err) {
    alert('Error al guardar: ' + err.message);
  }
  btn.disabled = false;
  btn.textContent = 'Guardar producto';
}

// Eliminar producto:
// - requiere confirmación
// - llama deleteProduct y recarga la lista
async function handleDelete(id) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  try {
    await deleteProduct(id);
    await loadProducts();
  } catch (e) {
    alert('Error: ' + e.message);
  }
}
