-- Regalo Mágico — esquema PostgreSQL (Electiva / equipo 1).
-- Docker monta ./bd en /docker-entrypoint-initdb.d: estos scripts corren solo la primera vez del volumen.
-- Para datos masivos tras ya tener volumen: node scripts/catalog-for-db.mjs + backend/scripts/import-catalog-json.mjs.

-- Catálogo publicado por GET /api/productos (fotos: JSON array de strings URI relativas o absolutas).
CREATE TABLE IF NOT EXISTS productos (
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

-- Índices típicos de consultas del API y del panel futuro.
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos (activo);

-- Pedidos opcionales vía POST /api/pedidos (snapshot JSON del carrito en `items`).
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_nombre TEXT,
  cliente_telefono TEXT,
  notas TEXT,
  items JSONB NOT NULL,
  total INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orden cronológico inverso (últimos pedidos primero) sin ordenar tabla completa en cada GET futuro.
CREATE INDEX IF NOT EXISTS idx_pedidos_created ON pedidos (created_at DESC);
