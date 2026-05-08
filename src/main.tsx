/**
 * Punto de entrada de la SPA (Single Page Application).
 * Monta React en el div `#root` de index.html y activa StrictMode (avisos extra en desarrollo).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/** Punto de montaje único de React (no hay SSR en este proyecto). */
const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Falta el elemento #root');

/** StrictMode en desarrollo dispara efectos dos veces y muestra warnings deprecados útiles. */
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
