# Uso del material de clases — proyecto Regalo-Mágico (`regalo-magico`)

Este documento relaciona **conceptos vistos en clase** con **archivos concretos** del frontend en la carpeta `src/` del repositorio [Regalo-Magico](https://github.com/jchantre-jpg/Regalo-Magico).

---

## 1. React Hooks (`useState`, `useEffect`, y otros)

| Hook | Archivo | Líneas (aprox.) | Qué hace |
|------|-----------|-----------------|----------|
| `useState` | `src/hooks/useProductsCatalog.ts` | 10–11 | Guarda la lista de productos (`products`) y si ya terminó la carga (`ready`). |
| `useEffect` | `src/hooks/useProductsCatalog.ts` | 13–21 | Al montar el componente ejecuta `fetchProducts()`; al desmontar evita actualizar estado si la petición llega tarde (`alive`). |
| `useState` | `src/context/CartContext.tsx` | 36 | Estado del carrito: array `items` (inicial desde `localStorage`). |
| `useCallback` | `src/context/CartContext.tsx` | 38–79 | Funciones estables `persist`, `add`, `remove`, `updateQty`, `clear` para no recrear funciones en cada render. |
| `useMemo` | `src/context/CartContext.tsx` | 83–89 | Calcula `total` (suma precio × cantidad), `count` (unidades) y el objeto `value` del contexto. |
| `useContext` | `src/context/CartContext.tsx` | 96 | En `useCart()` lee el valor publicado por `CartProvider`. |
| `useState` | `src/components/ProductImage.tsx` | ~14–15 | Estado local `broken` cuando falla la carga de la imagen (fallback a emoji). |
| `useState` | `src/pages/StorefrontPage.tsx` | ~31–34 | Filtro de categoría, carrito abierto, menú móvil, producto seleccionado en el modal. |
| `useMemo` | `src/pages/StorefrontPage.tsx` | ~36–39 | Lista `filtered` según la categoría seleccionada. |
| `useCallback` | `src/pages/StorefrontPage.tsx` | varias | `scrollTo`, `openCart` / `closeCart` / `toggleCart`, `openModal` / `closeModal`, handlers de WhatsApp y agregar al carrito. |
| `useEffect` | `src/hooks/useBodyScrollLock.ts` | cuerpo del hook | Si `locked === true`, fija `overflow: hidden` en `document.body` y lo restaura al desmontar o al desbloquear. |
| `useEffect` | `src/hooks/useEscapeKey.ts` | cuerpo del hook | Si está habilitado, escucha **keydown** y ejecuta el callback al pulsar **Escape** (patrón reutilizable). |

### Hook personalizado (Custom Hook)

- **`useProductsCatalog`** — archivo `src/hooks/useProductsCatalog.ts`: encapsula la lógica de cargar el catálogo una vez y exponer `{ products, ready }`.
- **`useBodyScrollLock`** — archivo `src/hooks/useBodyScrollLock.ts`: evita duplicar código para bloquear el scroll cuando el carrito o el modal están abiertos (`StorefrontPage` pasa una condición del tipo *hay carrito abierto o hay producto en el modal*).
- **`useEscapeKey`** — archivo `src/hooks/useEscapeKey.ts`: centraliza el listener de teclado para cerrar overlays; `StorefrontPage` lo usa solo cuando hay carrito o modal abiertos.

### Context API (estado global)

- **`CartProvider`** + **`useCart()`** — archivo `src/context/CartContext.tsx`: carrito compartido por toda la app (envuelto en `src/App.tsx`).

---

## 2. Interfaces (`interface`)

Definen la **forma** de los datos en TypeScript.

| Interface | Archivo | Líneas (aprox.) | Propósito |
|-----------|---------|-----------------|-----------|
| `CatalogConfig` | `src/data/catalog.ts` | 6–10 | Forma del objeto de configuración (WhatsApp, mensaje). |
| `Categoria` | `src/data/catalog.ts` | 12–16 | Categoría del menú / filtros (`id`, `nombre`, `icono`). |
| `Product` | `src/data/catalog.ts` | 18–27 | Producto en tienda y carrito (`id`, `nombre`, `precio`, `fotos`, etc.). |
| `ImportMetaEnv` | `src/vite-env.d.ts` | 6–13 | Tipado de variables `VITE_*` en `import.meta.env`. |
| `ImportMeta` | `src/vite-env.d.ts` | 15–17 | Une `env` con el tipo anterior. |

Tip adicional: **`export type CartItem`** en `src/context/CartContext.tsx` extiende `Product` con `quantity` (tipo derivado, no `interface` pero mismo rol de contrato).

---

## 3. Props (propiedades de componentes)

Los componentes reciben datos por **props**.

| Ejemplo | Archivo | Descripción |
|---------|---------|-------------|
| `ProductImage({ product, className })` | `src/components/ProductImage.tsx` | Props `product` (`Product`) y `className` opcional; encapsula imagen + fallback emoji. |
| `CartProvider({ children })` | `src/context/CartContext.tsx` | Prop estándar **`children`** (`ReactNode`): todo lo envuelto usa el contexto del carrito. |
| `StoreHeader({ navOpen, setNavOpen, cartOpen, toggleCart, cartCount, scrollTo })` | `src/components/StoreHeader.tsx` | Cabecera: menú móvil, carrito y navegación por anclas vía `scrollTo`. |
| `WhatsAppFloatButton({ whatsappHref, onClick })` | `src/components/WhatsAppFloatButton.tsx` | Botón flotante; el padre define el comportamiento en `onClick`. |
| `HeroSection({ onExploreProducts })` | `src/components/HeroSection.tsx` | CTA del hero delegado en un callback. |
| `CategoriesSection({ onPickCategory })` | `src/components/CategoriesSection.tsx` | Al elegir categoría se notifica al padre (filtro + scroll). |
| `ProductCatalogSection({ filter, setFilter, ready, products, catName, onOpenModal, onAddToCart })` | `src/components/ProductCatalogSection.tsx` | Filtros + grilla; no usa `useCart` directamente, solo callbacks. |
| `ContactSection({ onWhatsAppClick })` | `src/components/ContactSection.tsx` | Contacto con handler para WhatsApp. |
| `CartSidebar({ open, onClose, items, total, … })` | `src/components/CartSidebar.tsx` | Panel del carrito controlado por props. |
| `ProductDetailModal({ product, categoryLabel, onClose, onAddToCart })` | `src/components/ProductDetailModal.tsx` | Modal de detalle (el padre decide cuándo montarlo). |
| `WhatsAppIcon({ size, className })` | `src/components/WhatsAppIcon.tsx` | SVG reutilizable en varios botones. |

El resto de elementos JSX reciben props HTML/React habituales: `href`, `className`, `onClick`, `aria-*`, etc.

---

## 4. Eventos (event handlers)

| Tipo | Archivo principal | Uso |
|------|-------------------|-----|
| `onClick` | `src/pages/StorefrontPage.tsx` | Orquestación: WhatsApp flotante, contacto, checkout; pasa callbacks a los hijos. |
| `onClick` | `src/components/StoreHeader.tsx` | Logo y enlaces del nav (scroll suave); botón carrito y menú hamburguesa. |
| `onClick` / `onKeyDown` | `src/components/CategoriesSection.tsx` | Tarjetas de categoría activables con teclado (Enter / Espacio). |
| `onClick` / `onKeyDown` | `src/components/ProductCatalogSection.tsx` | Tarjetas de producto, filtros, botones “Agregar” / “Ver más”. |
| `onClick` | `src/components/CartSidebar.tsx` | Cerrar overlay, cantidades, eliminar línea, checkout, “Ver productos”. |
| `onClick` | `src/components/ProductDetailModal.tsx` | Cerrar modal, overlay y “Agregar al carrito”. |
| `onError` | `src/components/ProductImage.tsx` | En `<img>`: si falla la URL, activa estado `broken` y muestra emoji. |
| `addEventListener('keydown')` | `src/hooks/useEscapeKey.ts` (vía `useEffect`) | Escape global para cerrar carrito y modal (usado desde `StorefrontPage`). |

Tipado: se importa **`MouseEvent`** desde React donde hace falta (p. ej. botón flotante WhatsApp en `StorefrontPage`).

---

## 5. Funciones

- **Componentes como funciones**: `App`, `StorefrontPage`, `CartProvider`, `ProductImage`, `StoreHeader`, `ProductCatalogSection`, `CartSidebar`, `ProductDetailModal`, `HeroSection`, `HowItWorksSection`, `ContactSection`, `SiteFooter`, `WhatsAppFloatButton`, `WhatsAppIcon`, etc.
- **Funciones auxiliares**: `fetchProducts`, `normalizeRow`, `formatWhatsAppOrderText`, `publicUrl`, `formatPriceCOP`, etc.
- **Callbacks**: funciones pasadas a `useCallback` en la página contenedora o como props (`onAddToCart`, `onOpenModal`, `scrollTo`, `() => setFilter('todos')` en `ProductCatalogSection`).

---

## 6. Objetos literales

| Ejemplo | Archivo | Uso |
|---------|---------|-----|
| `CONFIG = { whatsappLink, whatsappNumber, orderMessage }` | `src/data/catalog.ts` | Configuración de contacto; va seguido de `satisfies CatalogConfig`. |
| Elementos de `CATEGORIAS` y `PRODUCTOS` | `src/data/catalog.ts` | Objetos `{ id, nombre, ... }` dentro de arrays. |
| Retorno de `normalizeRow` | `src/services/fetchProducts.ts` | Objeto literal que cumple `Product` a partir del JSON del API. |
| Opciones `{ orderFlow: boolean }` | `src/utils/whatsapp.ts` | Objeto de opciones en `openWhatsAppWithText`. |

---

## 7. Operadores ternarios (`condición ? a : b`)

| Idea | Dónde suele verse |
|------|-------------------|
| Clases CSS condicionales | `StoreHeader`: `navOpen ? 'active' : ''`; `ProductCatalogSection`: filtros `filter === 'todos' ? ' active' : ''`; `CartSidebar`: overlay/sidebar `open ? ' active' : ''`; `ProductDetailModal`: modal siempre activo cuando el padre lo monta. |
| Abrir/cerrar carrito desde la cabecera | `StorefrontPage` usa `toggleCart` (`setCartOpen((open) => !open))` pasado a `StoreHeader`. |
| Texto de pedido vs lista vacía | `orderFlow ? items : []` al llamar a `formatWhatsAppOrderText` (`StorefrontPage`). |
| Lectura de `localStorage` | `src/context/CartContext.tsx`: `raw ? JSON.parse(...) : []`. |
| Actualizar línea del carrito en `map` | expresión `condición ? { ...nuevo } : i`. |
| Render condicional | `StorefrontPage`: `{modalProduct ? <ProductDetailModal … /> : null}`; `CartSidebar`: carrito vacío vs lista de ítems y footer con total. |

También se usa **optional chaining** (`?.`) y **nullish coalescing** (`??`) en varios archivos (material relacionado con condiciones y valores por defecto).

---

## 8. Lista breve de tecnologías / patrones del mismo proyecto

| Tema | ¿Se usa? | Notas |
|------|----------|--------|
| **Tailwind CSS** | Sí (integrado) | `vite.config.ts` + `@import "tailwindcss"` en `src/styles.css`. La UI visible usa sobre todo **CSS propio** con clases semánticas (`.header`, `.btn-primary`, …), no solo utilidades `flex gap-4`. |
| **Vite + React + TypeScript** | Sí | Entrada `index.html` → `src/main.tsx` → `src/App.tsx`. |
| **Fetch / API** | Sí | `src/services/fetchProducts.ts` → `GET .../productos` cuando `VITE_USE_API` es `'true'`. |
| **Separación en componentes** | Sí | Vista principal troceada en `src/components/*`: presentación y callbacks por props; estado global sigue en `CartContext`; estado de página (filtros, modales) en `StorefrontPage`. |

---

## 9. Mapa rápido de carpetas `src/`

| Ruta | Rol |
|------|-----|
| `src/App.tsx` | Monta `CartProvider` y `StorefrontPage`. |
| `src/main.tsx` | `createRoot` y `StrictMode`. |
| `src/pages/StorefrontPage.tsx` | Orquesta la tienda: datos (`useProductsCatalog`), carrito (`useCart`), estado UI (filtro, drawer, modal), hooks `useBodyScrollLock` / `useEscapeKey`, y compone las secciones importadas desde `components/`. |
| `src/components/` | Piezas reutilizables de UI + archivo barril `index.ts` (ver §10). |
| `src/context/CartContext.tsx` | Estado global del carrito + `localStorage`. |
| `src/hooks/useProductsCatalog.ts` | Carga del catálogo. |
| `src/hooks/useBodyScrollLock.ts` | Bloqueo de scroll del documento con overlays abiertos. |
| `src/hooks/useEscapeKey.ts` | Atajo Escape para cerrar overlays. |
| `src/services/fetchProducts.ts` | API + fallback a datos estáticos. |
| `src/data/catalog.ts` | Interfaces, `CONFIG`, `CATEGORIAS`, `PRODUCTOS`. |
| `src/utils/` | `whatsapp.ts`, `publicUrl.ts`, `formatPrice.ts`. |
| `src/vite-env.d.ts` | Tipos de variables de entorno `VITE_*`. |

---

## 10. Componentización de la tienda (`src/components/`)

Tras la refactorización, la página única **no concentra todo el JSX en un solo archivo**: cada bloque visual tiene un componente con responsabilidad acotada y comunicación por **props** (patrón típico de React: *smart container* `StorefrontPage` + *presentational* hijos).

**Barril de imports:** `src/components/index.ts` re-exporta los componentes siguientes para poder escribir `import { CartSidebar, StoreHeader, … } from '../components'` desde `StorefrontPage` (menos rutas largas y orden al importar).

| Archivo | Responsabilidad |
|---------|-----------------|
| `ProductImage.tsx` | Imagen del producto o fallback emoji (`useState` para error de carga). |
| `WhatsAppIcon.tsx` | Ícono SVG compartido (tamaño configurable). |
| `WhatsAppFloatButton.tsx` | Botón flotante “Pedir por WhatsApp”. |
| `StoreHeader.tsx` | Header, navegación, contador del carrito y menú móvil. |
| `HeroSection.tsx` | Hero de inicio y CTA “Explorar regalos”. |
| `CategoriesSection.tsx` | Grilla de categorías que dispara filtro + scroll. |
| `ProductCatalogSection.tsx` | Filtros por categoría + grilla de tarjetas de producto. |
| `HowItWorksSection.tsx` | Pasos “¿Cómo comprar?” (contenido mayormente estático). |
| `ContactSection.tsx` | Bloque de contacto con botón a WhatsApp. |
| `SiteFooter.tsx` | Pie de página y enlace a administración. |
| `CartSidebar.tsx` | Overlay + panel lateral del carrito y checkout. |
| `ProductDetailModal.tsx` | Modal de detalle de un producto (galería simple, descripción, agregar al carrito). |

**Flujo de datos (resumen):** `StorefrontPage` lee catálogo y carrito, calcula `filtered`, define `scrollTo` y los handlers de WhatsApp, y **pasa** a los hijos solo lo necesario (por ejemplo `ProductCatalogSection` no importa `useCart`; recibe `onAddToCart` ya enlazado con `add` + `openCart`).

---

## 11. Organización del repo, contenido docente y qué suele faltar

### Convenciones útiles en este proyecto

| Carpeta | Rol típico |
|---------|------------|
| `src/pages/` | Contenedor de pantalla que une datos (`hooks`, `services`), contexto (`useCart`) y estado UI local. |
| `src/components/` | Presentación: JSX y estilos por props; sin acoplar al API si se puede usar un callback (`onAddToCart`). |
| `src/hooks/` | Lógica reutilizable sin marcado (fetch del catálogo, scroll lock, tecla Escape). |
| `src/context/` | Estado global compartido por muchos descendientes (carrito + `localStorage`). |
| `src/services/` | Peticiones HTTP y normalización del JSON del backend. |
| `src/data/` | Tipos TypeScript y catálogo estático / `CONFIG`. |
| `src/utils/` | Funciones puras o auxiliares (precio, URLs, WhatsApp). |

### Documentación que conviene tener en el repo

| Recurso | Sirve para |
|---------|------------|
| `README.md` | Puesta en marcha, scripts (`dev`, `build`, `typecheck`), estructura de `src/`, Docker y enlaces a guías. |
| `DEPLOY-EQUIPO1.md` | Despliegue en VPS, PM2, Nginx y secretos de GitHub Actions. |
| `uso de material de clases.md` | Evidencia curso ↔ código (este documento). |
| `.env.example` | Lista **nombres** de variables `VITE_*` y proxy; nunca pegar contraseñas reales. |

### Checklist para no olvidar cosas (equipo / entrega)

1. **Actualizar la guía de clase** cuando se muevan hooks o componentes (tablas de las §1–§7 y mapa §9).
2. **Mantener `README.md` alineado** con carpetas reales (`pages`, `components`, `hooks`…).
3. **Archivo barril** `src/components/index.ts` si se añaden componentes nuevos (exportarlos ahí para imports cortos).
4. **Variables de entorno**: mismo significado en `.env.example`, `vite.config.ts` y documentación.
5. **CI**: que `npm run typecheck` y `npm run build` pasen en GitHub Actions antes de fusionar a `main`.
6. **Secretos**: no subir `.env`, llaves SSH ni tokens; usar *Secrets* del repositorio.
7. **Accesibilidad básica**: `skip-link`, `aria-expanded` / `aria-controls` en carrito y menú, teclado en tarjetas (Enter/Espacio).
8. **Lint opcional**: ESLint + Prettier no vienen configurados en este proyecto; añadirlos reduce errores de estilo y *bugs* evitables en equipo.
9. **Pruebas**: no hay Vitest/Jest aún; para robustez futura, priorizar tests de hooks (`fetchProducts`, carrito) con datos *mock*.
10. **Dos admins posibles**: la tienda React en `src/` y el panel en `public/admin.html` + JS en `public/js/`; son stack distinto; mencionarlo evita confusiones de rutas.

---

*Documento generado para apoyo del curso / evidencia de uso de conceptos en el código.*
