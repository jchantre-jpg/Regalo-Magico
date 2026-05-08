/**
 * Importa bd/catalog.import.json a PostgreSQL (reemplaza todos los productos).
 *
 * Variables de entorno (igual que el API): DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 *
 * Uso desde la raíz regalo-magico:
 *   node scripts/catalog-for-db.mjs
 *   node backend/scripts/import-catalog-json.mjs
 *
 * O con ruta explícita:
 *   node backend/scripts/import-catalog-json.mjs ruta/al/archivo.json
 */
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_JSON = path.resolve(__dirname, '..', '..', 'bd', 'catalog.import.json');

function poolFromEnv() {
  return new pg.Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'regalomagico1',
    user: process.env.DB_USER || 'equipo1',
    password: process.env.DB_PASSWORD || 'equipo1pass',
  });
}

async function main() {
  const positional = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const jsonPath = path.resolve(positional[0] || DEFAULT_JSON);

  if (!fs.existsSync(jsonPath)) {
    console.error('No existe el JSON. Genera primero:', DEFAULT_JSON);
    console.error('  cd regalo-magico && node scripts/catalog-for-db.mjs');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const items = raw.items;
  if (!Array.isArray(items) || items.length === 0) {
    console.error('El JSON no tiene "items" (array no vacío).');
    process.exit(1);
  }

  const pool = poolFromEnv();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM productos');

    const insertSql = `
      INSERT INTO productos (id, nombre, categoria, precio, emoji, descripcion, contenido, fotos, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, TRUE)
    `;

    for (const row of items) {
      const id = typeof row.id === 'number' ? row.id : parseInt(String(row.id), 10);
      const nombre = String(row.nombre ?? '').trim() || 'Producto';
      const categoria = String(row.categoria ?? 'personalizados').trim();
      const precio = typeof row.precio === 'number' ? Math.round(row.precio) : 0;
      const emoji = String(row.emoji ?? '🎁').trim();
      const descripcion = row.descripcion != null ? String(row.descripcion) : '';
      const contenido = row.contenido != null ? String(row.contenido) : null;
      const fotos = Array.isArray(row.fotos) ? row.fotos.filter((x) => typeof x === 'string') : [];

      if (!Number.isFinite(id)) {
        throw new Error(`ID inválido en fila: ${JSON.stringify(row)}`);
      }

      await client.query(insertSql, [
        id,
        nombre,
        categoria,
        precio,
        emoji,
        descripcion,
        contenido,
        JSON.stringify(fotos.length ? fotos : ['/imagenes/placeholder.jpg']),
      ]);
    }

    await client.query(
      `SELECT setval(pg_get_serial_sequence('productos', 'id'), COALESCE((SELECT MAX(id) FROM productos), 1))`
    );

    await client.query('COMMIT');
    console.log(`Importados ${items.length} productos desde ${jsonPath}`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
