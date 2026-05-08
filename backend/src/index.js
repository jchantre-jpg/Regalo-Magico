/**
 * API Regalo Mágico — Node (Express) + PostgreSQL (`pg`).
 *
 * Prefijo de rutas: `/api` (así Nginx del front puede proxificar `/api/` → este servicio).
 * Variables de entorno: PORT (default 8085 en Docker interno), DB_*, ADMIN_TOKEN opcional.
 *
 * Endpoints públicos típicos: GET /api/productos, POST /api/pedidos, GET /api/health.
 * Crear/editar productos: POST/PATCH /api/productos con cabecera Authorization: Bearer <ADMIN_TOKEN>.
 */
import cors from 'cors';
import express from 'express';
import pg from 'pg';

const { Pool } = pg;

const PORT = Number(process.env.PORT) || 8085;
/** Si está vacío, las rutas de administración de productos responden 503. */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

/** Parámetros de conexión al Postgres (en Docker: DB_HOST=db). */
function poolConfig() {
  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'regalomagico1',
    user: process.env.DB_USER || 'equipo1',
    password: process.env.DB_PASSWORD || 'equipo1pass',
    max: 12,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  };
}

/** Normaliza `fotos` desde BD (JSON array de strings u objetos `{ url }`) a lista de URLs. */
function normalizeFotos(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((f) => {
        if (typeof f === 'string') return f;
        if (f && typeof f === 'object' && typeof f.url === 'string') return f.url;
        return null;
      })
      .filter(Boolean);
  }
  return [];
}

/** Devuelve el objeto producto tal como lo consume el front (strings y array de fotos). */
function mapProductRow(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    precio: row.precio,
    emoji: row.emoji || '🎁',
    descripcion: row.descripcion || '',
    contenido: row.contenido || undefined,
    fotos: normalizeFotos(row.fotos),
  };
}

/** Middleware: compara `Authorization: Bearer …` o cabecera `x-admin-token` con `ADMIN_TOKEN`. */
function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) {
    res.status(503).json({ error: 'ADMIN_TOKEN no configurado en el servidor' });
    return;
  }
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  next();
}

/** Reintentos al arrancar (Postgres en Docker puede tardar segundos después del `node`). */
async function waitForDb(pool, attempts = 30, delayMs = 1000) {
  for (let i = 0; i < attempts; i++) {
    try {
      const c = await pool.connect();
      c.release();
      return;
    } catch {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('No se pudo conectar a PostgreSQL');
}

async function main() {
  /** Pool reutilizable de conexiones a Postgres. */
  const pool = new Pool(poolConfig());
  await waitForDb(pool);

  const app = express();
  /** El front puede estar en otro origen (Vite en localhost, app móvil, etc.). */
  app.use(cors({ origin: true }));
  /** Límite modesto: pedidos y creación de producto solo llevan JSON pequeño. */
  app.use(express.json({ limit: '512kb' }));

  /** Sub-router montado en app.use('/api', api) al final. */
  const api = express.Router();

  /** Comprobación de vida + que la BD responda. */
  api.get('/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ ok: true, service: 'regalomagico-api', db: true });
    } catch (e) {
      res.status(503).json({ ok: false, service: 'regalomagico-api', db: false });
    }
  });

  /** Listado para la tienda: mismo formato JSON que espera `fetchProducts` en el front. */
  api.get('/productos', async (_req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, nombre, categoria, precio, emoji, descripcion, contenido, fotos
         FROM productos WHERE activo = TRUE ORDER BY id ASC`
      );
      res.json(rows.map(mapProductRow));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Error leyendo productos' });
    }
  });

  /** Opcional: guardar pedido desde otro cliente (la tienda actual arma pedidos por WhatsApp). */
  api.post('/pedidos', async (req, res) => {
    try {
      const body = req.body || {};
      const items = body.items;
      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'items debe ser un arreglo no vacío' });
        return;
      }
      const cliente_nombre = typeof body.cliente_nombre === 'string' ? body.cliente_nombre : null;
      const cliente_telefono = typeof body.cliente_telefono === 'string' ? body.cliente_telefono : null;
      const notas = typeof body.notas === 'string' ? body.notas : null;
      const total = typeof body.total === 'number' ? Math.round(body.total) : null;

      const { rows } = await pool.query(
        `INSERT INTO pedidos (cliente_nombre, cliente_telefono, notas, items, total)
         VALUES ($1, $2, $3, $4::jsonb, $5) RETURNING id, created_at`,
        [cliente_nombre, cliente_telefono, notas, JSON.stringify(items), total]
      );
      res.status(201).json({ ok: true, id: rows[0].id, created_at: rows[0].created_at });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Error guardando pedido' });
    }
  });

  /** Alta de producto (herramientas / panel futuro). Requiere token admin. */
  api.post('/productos', requireAdmin, async (req, res) => {
    try {
      const b = req.body || {};
      const nombre = typeof b.nombre === 'string' ? b.nombre.trim() : '';
      const categoria = typeof b.categoria === 'string' ? b.categoria.trim() : '';
      const precio = typeof b.precio === 'number' ? Math.round(b.precio) : NaN;
      if (!nombre || !categoria || Number.isNaN(precio) || precio < 0) {
        res.status(400).json({ error: 'nombre, categoria y precio válidos son obligatorios' });
        return;
      }
      const emoji = typeof b.emoji === 'string' ? b.emoji : '🎁';
      const descripcion = typeof b.descripcion === 'string' ? b.descripcion : '';
      const contenido = typeof b.contenido === 'string' ? b.contenido : null;
      const fotos = normalizeFotos(b.fotos);

      const { rows } = await pool.query(
        `INSERT INTO productos (nombre, categoria, precio, emoji, descripcion, contenido, fotos)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
         RETURNING id, nombre, categoria, precio, emoji, descripcion, contenido, fotos`,
        [nombre, categoria, precio, emoji, descripcion, contenido, JSON.stringify(fotos)]
      );
      res.status(201).json(mapProductRow(rows[0]));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Error creando producto' });
    }
  });

  /** Actualización parcial por id (mismo token admin). */
  api.patch('/productos/:id', requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        res.status(400).json({ error: 'id inválido' });
        return;
      }
      const b = req.body || {};
      /** PATCH parcial: solo los campos presentes en el JSON forman el `SET` (evita pisar con undefined). */
      const fields = [];
      const vals = [];
      let n = 1;

      if (typeof b.nombre === 'string') {
        fields.push(`nombre = $${n++}`);
        vals.push(b.nombre.trim());
      }
      if (typeof b.categoria === 'string') {
        fields.push(`categoria = $${n++}`);
        vals.push(b.categoria.trim());
      }
      if (typeof b.precio === 'number' && !Number.isNaN(b.precio)) {
        fields.push(`precio = $${n++}`);
        vals.push(Math.round(b.precio));
      }
      if (typeof b.emoji === 'string') {
        fields.push(`emoji = $${n++}`);
        vals.push(b.emoji);
      }
      if (typeof b.descripcion === 'string') {
        fields.push(`descripcion = $${n++}`);
        vals.push(b.descripcion);
      }
      if (typeof b.contenido === 'string') {
        fields.push(`contenido = $${n++}`);
        vals.push(b.contenido);
      }
      if (b.fotos != null) {
        fields.push(`fotos = $${n++}::jsonb`);
        vals.push(JSON.stringify(normalizeFotos(b.fotos)));
      }
      if (typeof b.activo === 'boolean') {
        fields.push(`activo = $${n++}`);
        vals.push(b.activo);
      }

      if (fields.length === 0) {
        res.status(400).json({ error: 'No hay campos para actualizar' });
        return;
      }

      vals.push(id);
      const { rows } = await pool.query(
        `UPDATE productos SET ${fields.join(', ')} WHERE id = $${n} RETURNING id, nombre, categoria, precio, emoji, descripcion, contenido, fotos`,
        vals
      );
      if (rows.length === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json(mapProductRow(rows[0]));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Error actualizando producto' });
    }
  });

  /** Todas las rutas REST anteriores quedan bajo `/api`. */
  app.use('/api', api);

  /** `0.0.0.0` permite que el contenedor Docker sea accesible desde fuera. */
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Regalo Mágico API → http://127.0.0.1:${PORT}/api/productos`);
  });
}

/** Fallo de conexión a Postgres o error no capturado en rutas: sale con código 1 (Docker/PM2 reinician si configuraste restart). */
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
