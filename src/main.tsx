/**
 * Bootstrap de React: monta la app en `#root` de `index.html`.
 * `StrictMode` en desarrollo ayuda a detectar efectos y APIs obsoletos (doble render intencional).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Falta el elemento #root');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
