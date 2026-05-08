/**
 * Servidor Node mínimo para producción (VPS / PM2).
 *
 * NO es el API de productos: solo sirve archivos estáticos de `dist/` tras `npm run build`.
 * El verdadero backend está en `backend/` (Express + Postgres).
 *
 * - Puerto por defecto: 3006 (override con env PORT).
 * - `/health`: chequeo para balanceadores o monitoreo.
 * - Cualquier otra ruta → devuelve `index.html` (encaje típico de SPA).
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

/** En módulos ESM no existe `__dirname`; se reconstruye desde la URL del archivo actual. */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3006;
const app = express();

/** Respuesta JSON breve para health checks (sin tocar el disco). */
app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'regalo-magico-web',
    uptime: Math.floor(process.uptime()),
  });
});

const dist = path.join(__dirname, 'dist');
/** CSS/JS/imagenes con hash en nombre; rutas desconocidas caen al SPA. */
app.use(express.static(dist));

/** Fallback SPA: cualquier ruta no estática sirve index.html. */
app.use((_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

/** Escuchar en todas las interfaces facilita VPS / contenedores. */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Regalo Mágico → http://127.0.0.1:${PORT}`);
});
