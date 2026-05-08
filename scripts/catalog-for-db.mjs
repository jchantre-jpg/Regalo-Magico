/**
 * Genera bd/catalog.import.json desde public/imagenes + product-copy-overrides.json (app Expo).
 * Misma heurística que regalo-magico-app/scripts/generate-catalog.mjs.
 *
 * Uso (desde regalo-magico):
 *   node scripts/catalog-for-db.mjs
 * Luego importar a Postgres:
 *   npm run db:import-catalog --prefix backend
 *   (o el script db:import-catalog de la raíz que hace ambos pasos)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');
const IMAGENES_DIR = path.join(APP_ROOT, 'public', 'imagenes');
const OVERRIDES_FILE = path.join(APP_ROOT, '..', 'regalo-magico-app', 'product-copy-overrides.json');
const OUT_JSON = path.join(APP_ROOT, 'bd', 'catalog.import.json');

const EXT_RE = /\.(jpe?g|png|webp|avif)$/i;
/** Precio por defecto si no hay override en JSON (mismo valor orientativo que la app Expo). */
const PRECIO_DEFAULT = 45000;

/** Lectura opcional de textos/precios editados a mano en la carpeta hermana regalo-magico-app. */
function loadOverrides() {
  if (!fs.existsSync(OVERRIDES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

/** Heurística por nombre de archivo (palabras clave en español/inglés). */
function guessCategory(filename) {
  const f = filename.toLowerCase();
  if (/desayuno|desayun|caf[eé]|bandeja|taza|mug|pap[aá]|father|padre/.test(f)) return 'desayunos';
  if (/flor|ramo|rosas|girasol|gerbera|arreglo|bouquet|florer|jade|casablanca|tulip|lilium|hortensia|lisianthus|orqu[ií]dea/.test(f)) return 'flores';
  if (/chocolate|bomb[oó]n|kinder|choco|creme|bombones/.test(f)) return 'chocolates';
  if (/peluche|oso|osito|teddy|bear|pareja/.test(f)) return 'peluches';
  if (/globo|burbuja|balloon/.test(f)) return 'globos';
  if (/ancheta|canasta|cesta|sorpresa/.test(f)) return 'personalizados';
  return 'personalizados';
}

/** Emoji coherente con la categoría inferida (solo visual en tienda). */
function emojiFor(cat) {
  const m = {
    desayunos: '🍳',
    flores: '🌸',
    chocolates: '🍫',
    peluches: '🧸',
    globos: '🎈',
    personalizados: '✨',
  };
  return m[cat] ?? '🎁';
}

/** Normaliza capitalización por palabra para títulos legibles desde nombre de archivo. */
function titleCaseWords(s) {
  return s
    .split(/\s+/)
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ')
    .trim();
}

/** Quita sufijos típicos de export (scaled, dimensiones) para leer mejor el “nombre” base. */
function stripNoiseFromBase(base) {
  return base
    .replace(/\b(scaled|min|11zon|hdr|copy|249x9|webp|jpeg|jpg)\b/gi, '')
    .replace(/\b\d{3,4}x\d{3,4}\b/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Nombres de archivo que son solo hash hexadecimal no sirven como título comercial. */
function isHashLike(s) {
  const t = s.replace(/\s/g, '');
  return /^[a-f0-9]{14,}$/i.test(t);
}

/** Ref interna tipo “00123” → tratamos como nombre no humano y ponemos etiqueta genérica. */
function isOnlyDigits(s) {
  return /^\d{1,5}$/.test(s.trim());
}

/** Título legible desde el nombre del archivo; usa overrides o etiquetas genéricas si el nombre es basura/hash. */
function prettyName(file, id, categoria, overrides) {
  const o = overrides[file];
  if (o?.nombre) return o.nombre.length > 85 ? `${o.nombre.slice(0, 82)}…` : o.nombre;

  const baseRaw = file.replace(/\.[^.]+$/i, '');
  let base = stripNoiseFromBase(baseRaw);
  const firstPart = base.split(/\s*\(/)[0].trim();

  if (isHashLike(firstPart) || isOnlyDigits(firstPart)) {
    const labels = {
      desayunos: 'Desayuno o bandeja · ref.',
      flores: 'Arreglo floral · ref.',
      chocolates: 'Chocolates o bombones · ref.',
      peluches: 'Detalle con peluche · ref.',
      globos: 'Globos y decoración · ref.',
      personalizados: 'Ancheta o regalo sorpresa · ref.',
    };
    return `${labels[categoria] || 'Regalo · ref.'} ${id}`;
  }

  if (/^img\s/i.test(base)) {
    const cleaned = base
      .replace(/^img\s+/i, '')
      .replace(/\b(scaled|min|11zon)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length >= 3 && !isHashLike(cleaned.replace(/[-\s]/g, ''))) {
      const t = titleCaseWords(cleaned);
      return t.length > 48 ? `${t.slice(0, 46)}…` : t;
    }
    return `Foto catalogo · ref. ${id}`;
  }

  let t = titleCaseWords(firstPart);
  t = t.replace(/\s+/g, ' ');
  if (t.length > 48) t = `${t.slice(0, 46)}…`;
  return t || `Producto · ref. ${id}`;
}

/** Texto largo por categoría si no hay override (expectativas del cliente + CTA WhatsApp). */
function prettyDescription(file, categoria, overrides) {
  const o = overrides[file];
  if (o?.descripcion) return o.descripcion;

  const templates = {
    flores:
      'Contenido orientativo según la foto:\n• Flores frescas y follaje de temporada\n• Presentación según modelo (jarrón, caja, papel, etc.)\n• Tonos y variedad pueden variar un poco\n\nPara cantidad de tallos, colores exactos y precio, escríbenos por WhatsApp con la referencia del producto.',
    desayunos:
      'Contenido orientativo según la foto:\n• Bandeja, caja o canasta decorada\n• Alimentos, bebidas y/o snacks según disponibilidad del día\n• Puede incluir globos, letrero o topper\n\nConfirma ingredientes, horario de entrega y mensaje personalizado por WhatsApp.',
    chocolates:
      'Contenido orientativo según la foto:\n• Bombones o chocolates surtidos\n• Caja o empaque según modelo\n\nSabores, marcas y unidades: consúltanos por WhatsApp.',
    peluches:
      'Contenido orientativo según la foto:\n• Peluche u osito\n• Puede incluir globo, dulces o detalle adicional\n\nModelo, tamaño y color sujetos a stock — confirma por WhatsApp.',
    globos:
      'Contenido orientativo según la foto:\n• Globos metalizados, látex o burbuja\n• Mensajes y colores según disponibilidad\n\nMontaje y entrega: coordina por WhatsApp con la referencia.',
    personalizados:
      'Contenido orientativo según la foto:\n• Composición tipo ancheta, canasta o caja regalo\n• Puede incluir peluche, dulces, globos, flores, bebidas u otros detalles\n• Piezas y marcas pueden variar según stock en tienda\n\nListado exacto de lo que incluye tu modelo: escríbenos por WhatsApp indicando la referencia del producto.',
  };
  return templates[categoria] || templates.personalizados;
}

function main() {
  const overrides = loadOverrides();

  if (!fs.existsSync(IMAGENES_DIR)) {
    console.error('No existe la carpeta:', IMAGENES_DIR);
    process.exit(1);
  }

  /** Solo imágenes reconocidas; orden estable para ids secuenciales reproducibles. */
  const files = fs
    .readdirSync(IMAGENES_DIR)
    .filter((f) => EXT_RE.test(f))
    .filter((f) => !f.toLowerCase().endsWith('.crdownload'))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));

  const items = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const id = i + 1;
    const ovr = overrides[file];
    let categoria = guessCategory(file);
    if (ovr?.categoria && ['desayunos', 'flores', 'chocolates', 'peluches', 'globos', 'personalizados'].includes(ovr.categoria)) {
      categoria = ovr.categoria;
    }
    const nombre = prettyName(file, id, categoria, overrides);
    const precio =
      typeof ovr?.precio === 'number' && !Number.isNaN(ovr.precio) && ovr.precio >= 0 ? Math.round(ovr.precio) : PRECIO_DEFAULT;
    const descripcion = prettyDescription(file, categoria, overrides);
    const emoji = emojiFor(categoria);
    items.push({
      id,
      nombre,
      categoria,
      precio,
      emoji,
      descripcion,
      fotos: [`/imagenes/${file}`],
    });
  }

  /** Metadatos + items: lo consume import-catalog-json.mjs en Postgres. */
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceDir: path.relative(APP_ROOT, IMAGENES_DIR).replace(/\\/g, '/'),
    count: items.length,
    items,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
  console.log('OK:', OUT_JSON, `(${items.length} productos)`);
}

main();
