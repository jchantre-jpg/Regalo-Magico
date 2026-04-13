/**
 * RegaloMágico - Store de productos (API SQL o localStorage)
 * - Sin integración con servicios externos (solo API SQL o localStorage).
 * - Si USE_API=true, consume el backend Express (/api).
 * - Si USE_API=false, usa catálogo estático + datos locales en localStorage.
 */

// localStorage key para productos creados/éditados sin backend
const STORAGE_KEY = 'regalomagico_productos';
// sessionStorage key donde guardamos el token JWT del admin (login).
const ADMIN_TOKEN_KEY = 'regalomagico_admin_token';

// Wrapper de fetch para llamar la API.
// - Usa `API_BASE_URL` ya “resuelto” por api-config.js (8081 vs 8080).
// - Si hay token en sesión, adjunta Authorization: Bearer <token>
async function apiFetch(path, options = {}) {
  // Mantiene consistencia si API_BASE_URL se resolvió por puerto.
  if (typeof apiBaseUrlReady !== 'undefined') await apiBaseUrlReady;
  const url = `${API_BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${txt || res.statusText}`);
  }
  if (res.status === 204) return null;
  return await res.json();
}

/* --- localStorage (modo sin API) --- */
function getLocalProducts() {
  // Devuelve productos extra guardados en localStorage (modo “sin backend”).
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

function saveLocalProducts(arr) {
  // Persiste en localStorage.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function generateId() {
  // Id “local” (solo para diferenciar en localStorage).
  return 'loc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

function normalizeApiProduct(p) {
  // Normaliza la forma del producto para que el FRONT siempre maneje:
  // - `categoria` (en vez de categoria_id)
  // - `fotos` como array de strings (urls)
  const fotos = Array.isArray(p.fotos)
    ? p.fotos.map(f => (typeof f === 'string' ? f : f?.url)).filter(Boolean)
    : [];

  return {
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria || p.categoria_id,
    precio: p.precio,
    emoji: p.emoji,
    descripcion: p.descripcion,
    contenido: p.contenido,
    cantidad: p.cantidad ?? 1,
    fotos,
    activo: p.activo
  };
}

async function getProducts() {
  // Decide origen de datos según USE_API.
  // API backend (Postgres)
  if (typeof USE_API !== 'undefined' && USE_API) {
    const rows = await apiFetch('/productos');
    const apiList = Array.isArray(rows) ? rows.map(normalizeApiProduct) : [];

    // En modo API, mantenemos el catálogo estático como fallback/extra
    // (si el backend está vacío o si necesitas mostrar imágenes demo).
    const staticList = Array.isArray(PRODUCTOS)
      ? PRODUCTOS.map((p, i) => ({ ...p, id: p.id || i + 1 }))
      : [];

    if (apiList.length === 0) return staticList;

    // Mezcla: prioridad a la BD por nombre (evita duplicados con catálogo estático).
    const byName = new Map(apiList.map(p => [p.nombre, p]));
    const merged = [...apiList];
    staticList.forEach(p => {
      if (!byName.has(p.nombre)) merged.push(p);
    });
    return merged;
  }

  // Modo localStorage: catálogo estático + extras creados en el panel
  const base = Array.isArray(PRODUCTOS)
    ? PRODUCTOS.map((p, i) => ({ ...p, id: p.id || i + 1 }))
    : [];

  const extras = getLocalProducts();
  if (!extras || extras.length === 0) return base;

  const map = new Map(base.map(p => [String(p.id), p]));
  extras.forEach(p => {
    if (p && p.id != null) map.set(String(p.id), p);
  });
  return Array.from(map.values());
}

async function addProduct(data) {
  if (typeof USE_API !== 'undefined' && USE_API) {
    // Backend espera `categoria_id`; el front usa `categoria`.
    // Backend espera categoria_id (no categoria)
    const payload = { ...data, categoria_id: data.categoria };
    delete payload.categoria;
    const created = await apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return created?.id;
  }

  const id = generateId();
  const arr = getLocalProducts();
  arr.unshift({
    id,
    ...data,
    activo: true,
    createdAt: Date.now(),
    fotos: data.fotos || []
  });
  saveLocalProducts(arr);
  return id;
}

async function updateProduct(id, data) {
  if (typeof USE_API !== 'undefined' && USE_API) {
    // Actualizamos en backend. De nuevo: `categoria` -> `categoria_id`.
    const payload = { ...data, categoria_id: data.categoria };
    delete payload.categoria;

    await apiFetch(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return;
  }

  const arr = getLocalProducts();
  const idx = arr.findIndex(p => String(p.id) === String(id));
  if (idx >= 0) {
    arr[idx] = { ...arr[idx], ...data, updatedAt: Date.now() };
    saveLocalProducts(arr);
  }
}

async function deleteProduct(id) {
  if (typeof USE_API !== 'undefined' && USE_API) {
    // Borra en backend.
    await apiFetch(`/productos/${id}`, { method: 'DELETE' });
    return;
  }

  const arr = getLocalProducts().filter(p => String(p.id) !== String(id));
  saveLocalProducts(arr);
}

/* --- imágenes: en este proyecto se guardan como URLs/strings ---
 * - Si usas API: se envían como dataURL (misma lógica que antes).
 * - Si usas local: se guardan igual (en localStorage).
 */
async function uploadProductImage(file) {
  // Convierte File -> dataURL (string) para enviarla/guardarla.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadMultipleImages(files /* productId no se usa */) {
  // Convierte múltiples imágenes a strings y retorna array.
  const urls = [];
  for (const file of files) {
    urls.push(await uploadProductImage(file));
  }
  return urls;
}

