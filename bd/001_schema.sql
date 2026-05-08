-- Regalo Mágico — esquema PostgreSQL (Electiva / equipo 1)
-- Las migraciones en esta carpeta se ejecutan al crear el volumen de datos por primera vez.

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

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos (activo);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_nombre TEXT,
  cliente_telefono TEXT,
  notas TEXT,
  items JSONB NOT NULL,
  total INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_created ON pedidos (created_at DESC);
