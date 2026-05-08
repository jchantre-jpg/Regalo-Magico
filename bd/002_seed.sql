-- Semilla opcional: unos pocos productos para probar GET /api/productos sin import JSON.
-- Rutas en fotos deben existir bajo public/imagenes en la web o tu CDN.

INSERT INTO productos (nombre, categoria, precio, emoji, descripcion, contenido, fotos)
VALUES
(
  'Desayuno Sorpresa Reina Mamá',
  'desayunos',
  65000,
  '👑',
  'Desayuno temático con detalles dulces y decoración elegante. Escríbenos por WhatsApp para personalizar.',
  NULL,
  '["/imagenes/1.jpeg"]'::jsonb
),
(
  'Desayuno Sorpresa El Mejor Papá',
  'desayunos',
  85000,
  '👨',
  'Bandeja con sandwiches, snacks y decoración azul y dorado. Contenido según disponibilidad.',
  NULL,
  '["/imagenes/2.jpeg"]'::jsonb
),
(
  'Arreglo floral rosas y tulipanes',
  'flores',
  45000,
  '🌸',
  'Arreglo en tonos morados y blancos; presentación en jarrón o papel según stock.',
  NULL,
  '["/imagenes/3.jpeg"]'::jsonb
),
(
  'Ancheta peluche con dulces',
  'personalizados',
  55000,
  '✨',
  'Canasta con peluche, globo metálico y chocolates surtidos.',
  NULL,
  '["/imagenes/4.jpeg"]'::jsonb
),
(
  'Peluche decorativo',
  'peluches',
  35000,
  '🧸',
  'Peluche suave; modelo sujeto a disponibilidad en tienda.',
  NULL,
  '["/imagenes/3.jpeg"]'::jsonb
),
(
  'Globos metalizados (set)',
  'globos',
  28000,
  '🎈',
  'Set de globos para decoración de regalo o fiesta.',
  NULL,
  '["/imagenes/1.jpeg"]'::jsonb
);

-- Si la BD ya tenía datos, estos INSERT pueden chocar o duplicar; mejor vaciar tabla + import JSON o borrar volumen Docker una vez.
