/**
 * Servidor Node para producción (VPS / PM2).
 * Sirve la SPA compilada desde dist/ en el puerto 3006 (Electiva 5 — equipo 1).
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3006;
const app = express();

const dist = path.join(__dirname, 'dist');
app.use(express.static(dist));

app.get('*', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Regalo Mágico → http://127.0.0.1:${PORT}`);
});
