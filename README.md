# Regalo Mágico

Tienda web (catálogo, carrito y checkout vía WhatsApp) construida con **React 19**, **Vite 6**, **TypeScript** y **Tailwind CSS v4**. El repositorio incluye un **frontend SPA**, un **API REST** en Node (Express + PostgreSQL), scripts SQL en `bd/` y despliegue documentado para VPS.

**Requisitos:** Node **≥ 22** (raíz del proyecto; ver también `engines` en `package.json`).

---

## Estructura del proyecto

| Ruta | Descripción |
|------|-------------|
| `src/` | Aplicación React (SPA de la tienda) |
| `src/pages/` | Página(s) de alto nivel (p. ej. `StorefrontPage.tsx`). |
| `src/components/` | Piezas de UI reutilizables (header, catálogo, carrito, modal, etc.); ver también `src/components/index.ts`. |
| `src/context/` | Estado global compartido (`CartProvider` / carrito). |
| `src/hooks/` | Hooks propios (`useProductsCatalog`, `useBodyScrollLock`, `useEscapeKey`, …). |
| `src/services/` | Llamadas de datos (`fetchProducts` y API). |
| `src/data/` | Tipos e interfaces del catálogo estático (`catalog.ts`). |
| `src/utils/` | Utilidades (`whatsapp`, precios, URLs públicas). |
| `public/` | Activos estáticos e imágenes del catálogo |
| `backend/` | API Express + `pg` (productos, pedidos, salud; rutas bajo `/api`) |
| `bd/` | Scripts SQL inicializados por Postgres en Docker (`001_schema.sql`, `002_seed.sql`, …) |
| `server.js` | Servidor Express mínimo que sirve `dist/` tras `npm run build` (producción tipo SPA + `/health`) |
| `Dockerfile`, `docker-compose.yml`, `nginx.conf` | Stack local/producción en contenedores (front + API + Postgres) |
| `.github/workflows/` | CI (typecheck + build) y despliegue automático al hacer push a `main` |
| `DEPLOY-EQUIPO1.md` | Guía detallada VPS, PM2, Nginx y secretos de GitHub Actions |
| `uso de material de clases.md` | Relación temas del curso ↔ código; checklist de organización (§11). |

---

## Desarrollo local (solo frontend)

```bash
npm install
cp .env.example .env   # opcional: ajusta VITE_USE_API y proxy (en PowerShell: Copy-Item .env.example .env)
npm run dev
```

- Con **`VITE_USE_API=false`** el catálogo puede usar datos locales sin llamar al backend.
- Con **`VITE_USE_API=true`**, Vite proxifica `/api` al destino configurado (por defecto `http://127.0.0.1:8081`; ver `VITE_DEV_API_PROXY` en `.env`).

---

## Calidad y compilación

```bash
npm run typecheck   # TypeScript sin emitir archivos
npm run build       # typecheck + bundle de Vite → carpeta dist/
npm run preview     # sirve dist/ para probar el build
```

---

## Producción (sin Docker)

Tras `npm run build`:

```bash
node server.js
```

Por defecto escucha en el puerto **3006** (variable de entorno `PORT`). Sirve archivos de `dist/` y redirige rutas al `index.html` del SPA.

---

## Stack con Docker (Compose)

En la rama que incluya `docker-compose.yml` (p. ej. `main`):

```bash
docker compose up --build
```

Servicios típicos:

- **Frontend** (Nginx + SPA compilada): puerto host configurable (`FRONTEND_PORT`, por defecto **3006**).
- **Backend**: API en **8086** en el host (`BACKEND_PORT_HOST`).
- **PostgreSQL**: puerto host **54326** (`DB_PORT_HOST`) por defecto.

Variables útiles: `VITE_USE_API`, `VITE_API_BASE_URL`, `DB_*`, `ADMIN_TOKEN` (token para operaciones de administración de productos en la API). Ver comentarios en `docker-compose.yml` y `.env.example`.

---

## API (backend)

Prefijo: **`/api`**. Endpoints públicos habituales incluyen listado de productos, creación de pedidos y comprobación de salud; la administración de catálogo usa token (`ADMIN_TOKEN`). Detalle en `backend/src/index.js`.

---

## Ramas y despliegue

- Desarrollo: ramas `dev-*` (p. ej. `dev-juliana-chantre`).
- **Producción / CI-CD:** los pushes a **`main`** disparan el workflow de despliegue (pull en el VPS, `npm ci`, `npm run build`, reinicio PM2). No existe una rama separada llamada `prod`.

Pasos y secretos (`VPS_HOST`, `VPS_USER`, `VPS_PASSWORD`): ver **`DEPLOY-EQUIPO1.md`**.

---

## Documentación adicional

- **`uso de material de clases.md`**: mapa conceptos de clase ↔ código (`hooks`, props, eventos, componentización de `src/components/`, etc.). Incluye una checklist de organización y contenido que suele faltar en proyectos de equipo.

---

## Licencia

Proyecto privado del equipo (`private: true` en `package.json`).
