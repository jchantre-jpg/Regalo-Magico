# Uso del material de clases — proyecto Regalo-Mágico (`regalo-magico`)

Este documento relaciona **conceptos vistos en clase** con **archivos concretos** del frontend en la carpeta `src/` del repositorio [Regalo-Magico](https://github.com/jchantre-jpg/Regalo-Magico).

> Los números de línea pueden variar ligeramente entre commits o ramas (`main` vs `dev-juliana-chantre`). La idea y la ubicación del archivo son las mismas.

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
| `useState` | `src/pages/StorefrontPage.tsx` | 16 | En `ProductImage`: si la imagen falla (`broken`). |
| `useState` | `src/pages/StorefrontPage.tsx` | 36–39 | Filtro de categoría, carrito abierto, menú móvil, producto del modal. |
| `useMemo` | `src/pages/StorefrontPage.tsx` | 41 | Lista `filtered` según la categoría seleccionada. |
| `useCallback` | `src/pages/StorefrontPage.tsx` | 46–67 | `scrollTo`, `openCart`, `closeCart`, `openModal`, `closeModal`. |
| `useEffect` | `src/pages/StorefrontPage.tsx` | 73 | Escucha la tecla **Escape** para cerrar modal y carrito. |

### Hook personalizado (Custom Hook)

- **`useProductsCatalog`** — archivo `src/hooks/useProductsCatalog.ts`: encapsula la lógica de cargar el catálogo una vez y exponer `{ products, ready }`.

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
| `ProductImage({ product, className })` | `src/pages/StorefrontPage.tsx` | Props `product` (tipo `Product`) y `className` opcional para la imagen o fallback emoji. |
| `CartProvider({ children })` | `src/context/CartContext.tsx` | Prop estándar **`children`** (`ReactNode`): todo lo envuelto usa el contexto del carrito. |

El resto de elementos JSX reciben props HTML/React habituales: `href`, `className`, `onClick`, `aria-*`, etc.

---

## 4. Eventos (event handlers)

| Tipo | Archivo principal | Uso |
|------|-------------------|-----|
| `onClick` | `src/pages/StorefrontPage.tsx` | Navegación por anclas, abrir/cerrar carrito y menú, filtros, agregar productos, WhatsApp, cerrar modales. |
| `onKeyDown` | `src/pages/StorefrontPage.tsx` | Accesibilidad en tarjetas (Enter / Espacio para activar como clic). |
| `onError` | `src/pages/StorefrontPage.tsx` | En `<img>` de `ProductImage`: si falla la URL, se muestra el emoji. |
| `addEventListener('keydown')` | `src/pages/StorefrontPage.tsx` (dentro de `useEffect`) | Escape global para cerrar overlays. |

Tipado: se importa **`MouseEvent`** desde React para algunos manejadores (p. ej. botón flotante WhatsApp).

---

## 5. Funciones

- **Componentes como funciones**: `App`, `StorefrontPage`, `CartProvider`, `ProductImage`, etc.
- **Funciones auxiliares**: `fetchProducts`, `normalizeRow`, `formatWhatsAppOrderText`, `publicUrl`, `formatPriceCOP`, etc.
- **Callbacks**: funciones pasadas a `useCallback` o escritas inline en JSX (`() => setFilter('todos')`).

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
| Clases CSS condicionales | `src/pages/StorefrontPage.tsx`: `navOpen ? 'active' : ''`, filtros `filter === 'todos' ? ' active' : ''`, overlays del carrito/modal. |
| Un solo botón para abrir/cerrar carrito | `cartOpen ? closeCart() : openCart()`. |
| Texto de pedido vs lista vacía | `orderFlow ? items : []` al llamar a `formatWhatsAppOrderText`. |
| Lectura de `localStorage` | `src/context/CartContext.tsx`: `raw ? JSON.parse(...) : []`. |
| Actualizar línea del carrito en `map` | expresión `condición ? { ...nuevo } : i`. |

También se usa **optional chaining** (`?.`) y **nullish coalescing** (`??`) en varios archivos (material relacionado con condiciones y valores por defecto).

---

## 8. Lista breve de tecnologías / patrones del mismo proyecto

| Tema | ¿Se usa? | Notas |
|------|----------|--------|
| **Tailwind CSS** | Sí (integrado) | `vite.config.ts` + `@import "tailwindcss"` en `src/styles.css`. La UI visible usa sobre todo **CSS propio** con clases semánticas (`.header`, `.btn-primary`, …), no solo utilidades `flex gap-4`. |
| **Vite + React + TypeScript** | Sí | Entrada `index.html` → `src/main.tsx` → `src/App.tsx`. |
| **Fetch / API** | Sí | `src/services/fetchProducts.ts` → `GET .../productos` cuando `VITE_USE_API` es `'true'`. |

---

## 9. Mapa rápido de carpetas `src/`

| Ruta | Rol |
|------|-----|
| `src/App.tsx` | Monta `CartProvider` y `StorefrontPage`. |
| `src/main.tsx` | `createRoot` y `StrictMode`. |
| `src/pages/StorefrontPage.tsx` | Pantalla principal de la tienda (eventos, estado UI). |
| `src/context/CartContext.tsx` | Estado global del carrito + `localStorage`. |
| `src/hooks/useProductsCatalog.ts` | Carga del catálogo. |
| `src/services/fetchProducts.ts` | API + fallback a datos estáticos. |
| `src/data/catalog.ts` | Interfaces, `CONFIG`, `CATEGORIAS`, `PRODUCTOS`. |
| `src/utils/` | `whatsapp.ts`, `publicUrl.ts`, `formatPrice.ts`. |
| `src/vite-env.d.ts` | Tipos de variables de entorno `VITE_*`. |

---

*Documento generado para apoyo del curso / evidencia de uso de conceptos en el código.*
