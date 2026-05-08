# 🎁 Regalo Mágico - Tienda E-commerce

Plataforma web full-stack para compra de cajas de regalos y chocolates. Proyecto de Electiva 5, Equipo 1.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tech Stack](#tech-stack)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Setup](#instalación-y-setup)
- [Scripts Disponibles](#scripts-disponibles)
- [Variables de Entorno](#variables-de-entorno)
- [Deployment](#deployment)

---

## 🏗️ Arquitectura

El proyecto está compuesto por tres capas independientes:

### Frontend (Vite + React + TypeScript + Tailwind)
- **App**: One-page app (`StorefrontPage`) con funcionalidades de tienda
- **Estado**: React Context (`CartContext`) con persistencia en localStorage
- **Características**:
  - Catálogo filtrable por categorías
  - Carrito de compras dinámico
  - Modal de detalles de producto
  - Checkout via WhatsApp (sin pasarela de pagos)

### Backend (Express + PostgreSQL)
- **API REST**: Endpoints para consultar productos
- **Base de datos**: PostgreSQL 16 con tabla `productos`
- **Características**:
  - CORS habilitado
  - Health check
  - Importación masiva de catálogo desde JSON

### Servidor Estático (VPS / Producción)
- **server.js**: Express mínimo que sirve archivos desde `dist/`
- **SPA Fallback**: Todas las rutas devuelven `index.html`
- **Health endpoint**: `/health` para monitoreo

---

## 🛠 Tech Stack

| Capa | Tecnologías |
|------|------------|
| **Frontend** | React 19, TypeScript 6, Tailwind CSS 4, Vite 6 |
| **Backend** | Node.js >=20, Express 5, PostgreSQL 16, pg 8 |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Build** | Vite, TypeScript compiler, Tailwind |

---

## 📁 Estructura del Proyecto

```
Regalo-Magico/
├── src/                          # Frontend (React)
│   ├── App.tsx                   # Raíz de la app
│   ├── main.tsx                  # Entry point Vite
│   ├── styles.css                # Estilos globales (Tailwind)
│   ├── context/
│   │   └── CartContext.tsx       # Estado global del carrito
│   ├── pages/
│   │   └── StorefrontPage.tsx    # Página principal
│   ├── hooks/
│   │   └── useProductsCatalog.ts # Hook para cargar productos
│   ├── services/
│   │   └── fetchProducts.ts      # Llamadas a API
│   ├── utils/
│   │   ├── formatPrice.ts        # Formateo COP
│   │   ├── publicUrl.ts          # Resolver URLs públicas
│   │   └── whatsapp.ts           # Integración WhatsApp
│   └── data/
│       └── catalog.ts            # Catálogo estático (fallback)
│
├── backend/                      # API (Express + Postgres)
│   ├── src/
│   │   └── index.js              # Servidor Express
│   ├── scripts/
│   │   └── import-catalog-json.mjs # Importador de catálogo
│   ├── package.json
│   └── Dockerfile
│
├── bd/                           # SQL inicial
│   ├── 001_schema.sql            # Esquema de base de datos
│   └── 002_seed.sql              # Datos iniciales
│
├── public/                       # Archivos estáticos públicos
│   ├── admin.html                # Panel admin
│   ├── css/
│   │   └── admin.css
│   ├── js/
│   │   ├── admin.js
│   │   ├── api-config.js
│   │   ├── cart.js
│   │   ├── main.js
│   │   ├── products-store.js
│   │   └── products.js
│   └── imagenes/                 # Imágenes de productos
│
├── scripts/                      # Utilidades de deploy
│   ├── catalog-for-db.mjs        # Exportar catálogo a JSON
│   └── vps-setup.sh              # Setup en VPS
│
├── server.js                     # Servidor SPA (producción)
├── vite.config.ts                # Config Vite + proxy
├── docker-compose.yml            # Orquestación de servicios
├── Dockerfile                    # Build multi-etapa (frontend)
├── nginx.conf                    # Config Nginx para SPA + proxy /api
├── tsconfig.json                 # Config TypeScript (src/)
├── tsconfig.node.json            # Config TypeScript (config files)
├── package.json                  # Dependencias frontend
└── index.html                    # Entry HTML de Vite
```

---

## 🚀 Instalación y Setup

### Requisitos Previos
- Node.js >= 22.0.0 (frontend) y >= 20.0.0 (backend)
- Docker y Docker Compose (para infraestructura)
- npm o yarn

### Setup Local (Desarrollo)

1. **Clonar e instalar dependencias**
   ```bash
   cd Regalo-Magico
   npm install
   cd backend
   npm install
   cd ..
   ```

2. **Configurar variables de entorno**
   Crear `.env.local` en la raíz:
   ```env
   VITE_USE_API=false          # Usar catálogo estático en desarrollo inicial
   VITE_API_BASE_URL=/api
   VITE_DEV_API_PROXY=http://127.0.0.1:8086
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Frontend disponible en: `http://localhost:5173`

### Setup con Docker Compose

1. **Variables de entorno (`.env`)**
   ```env
   FRONTEND_PORT=3006
   BACKEND_PORT_HOST=8086
   BACKEND_PORT_INTERNAL=8085
   DB_NAME=regalomagico1
   DB_USER=equipo1
   DB_PASSWORD=equipo1pass
   ADMIN_TOKEN=tu-token-secreto
   VITE_USE_API=true
   VITE_API_BASE_URL=/api
   ```

2. **Iniciar servicios**
   ```bash
   docker-compose up --build
   ```
   - Frontend: http://localhost:3006
   - Backend API: http://localhost:8086
   - Base de datos: localhost:54326

---

## 📜 Scripts Disponibles

### Frontend
```bash
npm run dev           # Vite dev server (http://localhost:5173)
npm run build         # Build tipado + bundled para producción
npm run preview       # Preview local del build
npm run typecheck     # Validación de tipos TypeScript
npm run start         # Ejecutar server.js (SPA en VPS)
```

### Base de Datos
```bash
npm run catalog:export-db      # Exportar catálogo a JSON
npm run db:import-catalog      # Importar catálogo JSON a Postgres
```

### Backend
```bash
cd backend
npm start                       # Iniciar servidor Express (puerto 8085)
npm run import-catalog          # Importar catálogo
```

---

## 🔐 Variables de Entorno

### Frontend (`.env.local` o `.env`)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_USE_API` | Usar API remota vs catálogo estático | `true` |
| `VITE_API_BASE_URL` | Prefijo de rutas API | `/api` |
| `VITE_DEV_API_PROXY` | Target del proxy en `vite dev` | `http://127.0.0.1:8086` |

### Backend (Docker Compose o `.env`)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto interno del servidor Express | `8085` |
| `DB_HOST` | Host de la base de datos | `db` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `regalomagico1` |
| `DB_USER` | Usuario de PostgreSQL | `equipo1` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `equipo1pass` |
| `ADMIN_TOKEN` | Token para operaciones admin | `` |

### Docker Compose (`.env`)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `FRONTEND_PORT` | Puerto del navegador → Nginx | `3006` |
| `BACKEND_PORT_HOST` | Puerto del host → Backend | `8086` |
| `BACKEND_PORT_INTERNAL` | Puerto interno del Backend | `8085` |

---

## 🛒 Flujo de Compra

1. **Visualización de catálogo**
   - Frontend carga productos desde `/api/productos` (o `catalog.ts` si sin conexión)
   - Grilla con filtros por categoría

2. **Agregar al carrito**
   - Estado manejado por `CartContext` (React)
   - Persiste en `localStorage` con clave `regalomagico_cart`

3. **Checkout**
   - Genera mensaje formateado con detalles del pedido
   - Abre WhatsApp Web (no hay pasarela de pagos integrada)
   - Usuario completa pedido manualmente con vendedor

---

## 🌐 Endpoints API

### GET `/api/productos`
Retorna array de productos disponibles.

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Caja Corazón Chocolates",
    "categoria": "chocolates",
    "precio": 45000,
    "emoji": "🍫",
    "descripcion": "...",
    "contenido": "...",
    "fotos": ["url1", "url2"],
    "activo": true
  }
]
```

### GET `/health`
Chequeo de disponibilidad del servicio.

---

## 📦 Deployment

### VPS (sin Docker)

Ver [DEPLOY-EQUIPO1.md](DEPLOY-EQUIPO1.md) para instrucciones completas.

**Proceso resumido:**
1. Build local: `npm run build`
2. Subir `dist/` + `server.js` al VPS
3. Instalar dependencias: `npm install --production`
4. Iniciar con PM2: `pm2 start server.js --name regalo-magico`

### Docker Compose (desarrollo/staging)

```bash
docker-compose up --build -d
docker-compose logs -f
```

---

## 🔧 Configuración Nginx

El archivo [nginx.conf](nginx.conf) configura:
- Servir archivos estáticos desde `dist/`
- Proxy de `/api/*` al backend (puerto 8085)
- SPA fallback (todas las rutas → `index.html`)

---

## 📝 Base de Datos

### Tabla `productos`

```sql
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio INTEGER NOT NULL CHECK (precio >= 0),
  emoji TEXT NOT NULL DEFAULT '🎁',
  descripcion TEXT DEFAULT '',
  contenido TEXT,
  fotos JSONB NOT NULL DEFAULT '[]'::jsonb,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Inicialización

Los archivos en `bd/` se ejecutan automáticamente en Docker:
- `001_schema.sql`: Crea tabla y índices
- `002_seed.sql`: Datos iniciales

Para importar catálogo masivo:
```bash
npm run db:import-catalog
```

---

## 📧 Contacto / Equipo

Proyecto de **Electiva 5** - **Equipo 1**

---


