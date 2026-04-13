// RegaloMágico - Config de backend (Express + PostgreSQL)
// Este archivo vive en el FRONT pero sirve para definir:
// - a qué puerto/URL está respondiendo el backend
// - si el front usará o no la API SQL (USE_API)
//
// En este proyecto, `admin.js` y `products-store.js` consumen variables globales:
// - `API_BASE_URL` (se ajusta automáticamente según el puerto que responda)
// - `USE_API` (controla si se usa backend o localStorage)

let API_BASE_URL = 'http://localhost:8081/api';
const USE_API = true;

const FRONTEND_HOST = (typeof window !== 'undefined' && window.location && window.location.hostname)
  ? window.location.hostname
  : 'localhost';
const FRONTEND_PROTOCOL = (typeof window !== 'undefined' && window.location && window.location.protocol)
  ? window.location.protocol
  : 'http:';

// Mismo origen primero (Nginx en Docker reenvía /api → backend).
const API_BASE_URL_CANDIDATES = [];
if (typeof window !== 'undefined' && window.location?.origin) {
  API_BASE_URL_CANDIDATES.push(`${window.location.origin.replace(/\/$/, '')}/api`);
}
API_BASE_URL_CANDIDATES.push(
  `${FRONTEND_PROTOCOL}//${FRONTEND_HOST}:8081/api`,
  'http://localhost:8081/api'
);

// Helper para esperar un poco entre intentos (evita retries agresivos).
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// “Ping” al backend para detectar si está vivo y cuál puerto responde.
// Importante: apunta a `/health` porque ese endpoint existe en `backend/index.js`.
async function pingApiBaseUrl(apiBaseUrl) {
  const controller = new AbortController();
  // Timeout corto: si el puerto no responde rápido, no bloquea la UI.
  const t = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${apiBaseUrl}/health`, { signal: controller.signal, method: 'GET' });
    // Resolvemos como “OK” si la llamada devuelve 2xx/3xx (res.ok).
    return res && res.ok;
  } catch {
    // Cualquier error (refused, timeout, etc.) => no es ese puerto.
    return false;
  } finally {
    clearTimeout(t);
  }
}

// Se ejecuta en el momento en que se carga el script.
// Deja `API_BASE_URL` apuntando al primer candidato que responda.
// `admin.js` hace `await apiBaseUrlReady` antes del login.
const apiBaseUrlReady = (async () => {
  for (const candidate of API_BASE_URL_CANDIDATES) {
    if (await pingApiBaseUrl(candidate)) {
      API_BASE_URL = candidate;
      return;
    }
    // Pequeña espera entre intentos.
    await sleep(50);
  }
// Si ninguno responde, mantenemos el default (8081/api).
  // La UI fallará y mostrará error; pero al menos no rompe el resto del sitio.
})();


