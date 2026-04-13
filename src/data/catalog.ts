/**
 * RegaloMágico - Catálogo de productos
 * Configura aquí el número de WhatsApp y los productos
 */

export interface CatalogConfig {
  whatsappLink: string;
  whatsappNumber: string;
  orderMessage: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
}

export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  emoji?: string;
  fotos?: string[];
  descripcion?: string;
  contenido?: string;
}

export const CONFIG = {
  whatsappLink: 'https://api.whatsapp.com/send?phone=573143562274',
  whatsappNumber: '573143562274',
  // Mensaje predefinido para pedidos (debajo se agregan los productos que el cliente eligió)
  orderMessage: '¡Hola! Quiero hacer un pedido desde RegaloMágico.'
} satisfies CatalogConfig;

// Categorías disponibles en el catálogo.
// `main.js` usa esto para:
// - renderizar la grilla de categorías
// - renderizar botones de filtro
// - mostrar el nombre de la categoría en cada tarjeta
export const CATEGORIAS = [
  { id: 'desayunos', nombre: 'Desayunos', icono: '🍳' },
  { id: 'flores', nombre: 'Flores', icono: '🌸' },
  { id: 'chocolates', nombre: 'Chocolates', icono: '🍫' },
  { id: 'peluches', nombre: 'Peluches', icono: '🧸' },
  { id: 'globos', nombre: 'Globos', icono: '🎈' },
  { id: 'personalizados', nombre: 'Personalizados', icono: '✨' },
] satisfies readonly Categoria[];

// Catálogo estático (fallback).
// Usos:
// - `main.js` muestra estos productos si no hay API o si la carga falla
// - `products-store.js` puede mezclar estos datos con los que viene desde el backend
// - las fotos son paths relativos a `imagenes/` (ej: `imagenes/1.jpeg`)
export const PRODUCTOS = [
  { id: 1, nombre: 'Desayuno Sorpresa "Reina Mamá"', categoria: 'desayunos', precio: 65000, emoji: '👑', fotos: ['/imagenes/1.jpeg'], descripcion: `🎀 Desayuno Sorpresa "Reina Mamá" 🎀

Un detalle lleno de amor, dulzura y elegancia para sorprender desde el primer momento del día. 💕

Este hermoso desayuno incluye:
🧸 1 Tierno oso de peluche con corona, perfecto para recordarle que es la reina del hogar.
🍫 1 Cajita con deliciosos chocolates Ferrero Rocher para endulzar su mañana.
🌸 Finas flores en tonos rosados que aportan un toque romántico y delicado.
🥤 1 Vaso decorado especial para mamá.
🎁 Presentación premium en caja redonda con moño elegante en tonos rosa y dorado.

Ideal para celebrar el Día de la Madre, cumpleaños o simplemente para decir "Te amo, mamá" de una manera inolvidable. 👑💝

Sorprende, emociona y crea un momento mágico desde el amanecer. 🌅` },
  { id: 2, nombre: 'Desayuno Sorpresa "El Mejor Papá"', categoria: 'desayunos', precio: 85000, emoji: '👨', fotos: ['/imagenes/2.jpeg'], descripcion: `💙🎈 Desayuno Sorpresa "El Mejor Papá" 🎈💙

Sorprende a papá desde el primer momento del día con un detalle lleno de sabor, amor y celebración. 🥳

Este increíble desayuno incluye:

🥪 1 Sándwich fresco y delicioso
🥐 4 Croissants recién horneados
🧇 4 Mini waffles con frutas y Nutella
🍓 1 Parfait de yogur con granola y frutas
🥜 1 cajita con mix de frutos secos
🍺 1 Cerveza Corona
☕ 1 Bebida tipo café frío estilo Starbucks
🎈 1 Globo metálico "Happy Father's Day"
🎉 Decoración con globos en tonos azul y dorado
☕ 1 Mug especial "Te amo, Papá"
💌 Mensajes personalizados y detalles decorativos
🧺 Presentación en bandeja decorada lista para regalar

Un regalo perfecto para el Día del Padre, cumpleaños o simplemente para recordarle que es el mejor del mundo. 🌍💙

Haz que su mañana sea inolvidable con un desayuno lleno de detalles que enamoran. ✨` },
  { id: 3, nombre: 'Desayuno Sorpresa Cumpleaños', categoria: 'desayunos', precio: 125000, emoji: '🎂', fotos: ['/imagenes/3.jpeg'], descripcion: `🎂 Desayuno Sorpresa Cumpleaños 🎂

Hermosa caja decorativa color blanco y rosado con mensaje "Happy Birthday" al frente y detalle personalizado con el nombre.

Incluye:
🥐 Croissants
🍩 Donas glaseadas
🥖 Panes artesanales
🍫 Brownies de chocolate
🍓 Fresas frescas
🍯 Mini frascos de mermelada
🧃 Pequeños jugos en botella
🎈 Globo decorativo rosado con efecto brillante

Presentación elegante y especial, ideal para sorprender en cumpleaños. 💝` },
  { id: 4, nombre: 'Desayuno Sorpresa "Birthday Gold Black"', categoria: 'desayunos', precio: 45000, emoji: '🖤', fotos: ['/imagenes/4.jpeg'], descripcion: `🎉 Desayuno Sorpresa "Birthday Gold Black" 🎉

Un detalle elegante, moderno y lleno de estilo para celebrar un cumpleaños inolvidable desde el primer momento del día. 🖤✨

Este espectacular desayuno incluye:
🎈 Arreglo de globos en tonos negro y dorado con mensaje personalizado "Happy Birthday".
🧃 Botella de jugo natural decorada con moño elegante.
🍰 Deliciosa porción de torta, perfecta para celebrar.
🍬 Variedad de dulces y snacks seleccionados para disfrutar cada momento.
🥜 Frutos secos y golosinas en presentación premium.
🎁 Caja de lujo decorada en tonos negro y dorado con acabados elegantes.
💌 Tarjeta personalizada con nombre y edad para hacerlo aún más especial.

Ideal para sorprender en cumpleaños, especialmente celebraciones de 18 años o fechas importantes. 🥳

Sorprende, emociona y crea un momento único que jamás olvidará. 🌟

Personalizable con nombre, edad y mensaje especial. 💛` },
  // Imágenes organizadas por categoría real (revisadas)
  { id: 19, nombre: 'Peluches con corazones', categoria: 'peluches', precio: 45000, emoji: '🧸', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.32 AM.jpeg'], descripcion: 'Colección de peluches con corazones y mensajes de amor. Osos en blanco, café y gris con detalles en rojo. Ideal para cumpleaños, San Valentín o aniversario.' },
  { id: 20, nombre: 'Osos blancos I Love You', categoria: 'peluches', precio: 52000, emoji: '❤️', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.33 AM.jpeg'], descripcion: 'Par de adorables osos de peluche blancos sosteniendo corazones de lentejuelas con el mensaje "I ❤️ YOU". Perfecto para regalo de amor o cumpleaños.' },
  { id: 21, nombre: 'Variedad de peluches', categoria: 'peluches', precio: 38000, emoji: '🧸', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.34 AM.jpeg'], descripcion: 'Peluches para toda ocasión: osos con gorro de graduación, Santa, rosas, corazones y diseños personalizados. Variedad de tamaños y colores.' },
  { id: 22, nombre: 'Arreglo floral con peluche', categoria: 'flores', precio: 95000, emoji: '🌸', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.41 AM.jpeg'], descripcion: 'Bouquet con flores variadas (aves del paraíso, rosas, girasoles, orquídeas, lilas) y osito blanco con remera "LOVE". Incluye tarjeta personalizada. Ideal para cumpleaños o día especial.' },
  { id: 23, nombre: 'Tulipanes rojos con globo y chocolates', categoria: 'flores', precio: 78000, emoji: '🌷', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.45 AM.jpeg'], descripcion: 'Ramo de tulipanes rojos en vaso con moño, globo corazón "I Love You", peluche pequeño y caja de Ferrero Rocher. Arreglo romántico para declarar amor o celebrar.' },
  { id: 24, nombre: 'Caja elefante Sueño Contigo', categoria: 'personalizados', precio: 65000, emoji: '🐘', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.47 AM.jpeg'], descripcion: 'Elefante de peluche gris con corazón rojo "Sueño Contigo", globo "Love You", chocolates y golosinas. Caja decorada con osito. Regalo romántico o decoración de habitación.' },
  { id: 25, nombre: 'Ramos rosas + peluche + Feliz Cumpleaños', categoria: 'flores', precio: 88000, emoji: '🌹', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.51 AM.jpeg'], descripcion: 'Arreglo de cumpleaños: ramo de rosas rojas con lazo, oso de peluche beige, caja de chocolates y globo metálico "Feliz Cumpleaños". Regalo completo y elegante.' },
  { id: 26, nombre: 'Bandeja Feliz Cumple', categoria: 'desayunos', precio: 72000, emoji: '🎂', fotos: ['/imagenes/WhatsApp Image 2026-02-26 at 10.33.57 AM.jpeg'], descripcion: 'Bandeja de cumpleaños con arco de globos morados y rosados, waffle o panqueque, jugo de naranja, mermelada, dulces y tarjeta "FELIZ CUMPLE". Presentación en bandeja con moño.' },
  // Chocolates (imágenes nuevas de la carpeta imagenes)
  { id: 27, nombre: 'Caja 36 piezas', categoria: 'chocolates', precio: 42000, emoji: '🍫', fotos: ['/imagenes/caja-36-piezas.jpg'], descripcion: 'Caja de chocolates surtidos con 36 piezas. Variedad de sabores para regalar o compartir.' },
  { id: 28, nombre: 'Caja 4 bombones', categoria: 'chocolates', precio: 15000, emoji: '🍫', fotos: ['/imagenes/caja-4-bombones-.jpg'], descripcion: 'Elegante caja con 4 bombones seleccionados. Ideal detalle para acompañar un regalo.' },
  { id: 29, nombre: 'Caja 4 piezas', categoria: 'chocolates', precio: 12000, emoji: '🍫', fotos: ['/imagenes/caja-4-piezas.jpg'], descripcion: 'Chocolates finos en caja de 4 piezas. Presentación premium.' },
  { id: 30, nombre: 'Caja 9 bombones', categoria: 'chocolates', precio: 28000, emoji: '🍫', fotos: ['/imagenes/Caja-9-bombones.jpg'], descripcion: 'Caja de 9 bombones de chocolate. Sabores surtidos, perfectos para regalo.' },
  { id: 31, nombre: 'Chocolates en forma de corazón', categoria: 'chocolates', precio: 32000, emoji: '❤️', fotos: ['/imagenes/caja-blanca-chocolates-forma-corazon-variedad-chocolates-sobre-fondo-blanco_116578-1827.avif'], descripcion: 'Caja blanca con chocolates en forma de corazón y variedad de sabores. Ideal para San Valentín o declaración de amor.' },
  { id: 32, nombre: 'Caja chocolate deslizable XL', categoria: 'chocolates', precio: 55000, emoji: '🍫', fotos: ['/imagenes/Caja-Chocolate-Deslizable-XL-scaled.jpg'], descripcion: 'Caja de chocolate deslizable tamaño XL. Presentación de lujo para ocasiones especiales.' },
  { id: 33, nombre: 'Caja chocolates surtidos', categoria: 'chocolates', precio: 38000, emoji: '🍫', fotos: ['/imagenes/caja-chocolates-surtidos-variedad-sabores_168058-780.avif'], descripcion: 'Chocolates surtidos con variedad de sabores. Para disfrutar o regalar.' },
  { id: 34, nombre: 'Caja de chocolates grande', categoria: 'chocolates', precio: 48000, emoji: '🍫', fotos: ['/imagenes/Caja-de-chocolates-grandes-surtidos-Creme_De_La_Creme.jpg'], descripcion: 'Caja grande de chocolates surtidos estilo Creme De La Creme. Regalo elegante.' },
  { id: 35, nombre: 'Caja de lujo café', categoria: 'chocolates', precio: 45000, emoji: '☕', fotos: ['/imagenes/CAJA-DE-LUJO-CAFE-.jpg'], descripcion: 'Caja de lujo con chocolates y temática café. Para amantes del chocolate y el café.' },
  { id: 36, nombre: 'Caja mujer Kinder', categoria: 'chocolates', precio: 25000, emoji: '🍫', fotos: ['/imagenes/CAJA-DE-MUJER-KINDER.png'], descripcion: 'Caja especial Kinder para ella. Chocolate suave y cremoso.' },
  { id: 37, nombre: 'Caja metal 9 piezas', categoria: 'chocolates', precio: 35000, emoji: '🍫', fotos: ['/imagenes/caja-metal-9-piezas.webp'], descripcion: 'Chocolates premium en caja metálica de 9 piezas. Reutilizable y elegante.' },
  { id: 38, nombre: 'Caja regalo chocolates', categoria: 'chocolates', precio: 40000, emoji: '🎁', fotos: ['/imagenes/caja-regalo-de-chocolates-pera-navidad.jpg'], descripcion: 'Caja regalo de chocolates. Ideal para Navidad o cualquier celebración.' },
  { id: 39, nombre: 'Caja sabores rectangular', categoria: 'chocolates', precio: 32000, emoji: '🍫', fotos: ['/imagenes/caja-sabores-rectangular-amarilla-1024x1024.jpg'], descripcion: 'Caja rectangular con variedad de sabores. Presentación amarilla, surtida.' },
  { id: 40, nombre: 'Caja para elegir bombones', categoria: 'chocolates', precio: 36000, emoji: '🍫', fotos: ['/imagenes/cajachocolateselejir.jpg'], descripcion: 'Caja de bombones para elegir. Variedad de rellenos y coberturas.' },
  { id: 41, nombre: 'Caja de bombones 2024', categoria: 'chocolates', precio: 42000, emoji: '🍫', fotos: ['/imagenes/Cajadebombones232024.webp'], descripcion: 'Caja de bombones artesanales. Edición especial, sabores clásicos y novedosos.' },
  { id: 42, nombre: 'Chocolate corporativo', categoria: 'chocolates', precio: 38000, emoji: '🍫', fotos: ['/imagenes/chocolate-corporativo.webp'], descripcion: 'Chocolates para regalo corporativo. Presentación profesional y elegante.' },
  { id: 43, nombre: 'Caja madera exquisita', categoria: 'chocolates', precio: 65000, emoji: '🍫', fotos: ['/imagenes/detalle-exquisita-caja-madera.webp'], descripcion: 'Exquisita caja de madera con chocolates seleccionados. Regalo premium.' },
  { id: 44, nombre: 'Caja negra chocolates', categoria: 'chocolates', precio: 52000, emoji: '🍫', fotos: ['/imagenes/exquisita-caja-negra-chocolates.webp'], descripcion: 'Caja negra con chocolates de alta gama. Presentación sofisticada.' },
  { id: 45, nombre: 'Box of Chocolates', categoria: 'chocolates', precio: 35000, emoji: '🍫', fotos: ['/imagenes/field_image_pixabay-box-of-chocolates-1024x768.jpg'], descripcion: 'Clásica caja de chocolates surtidos. Para regalar en cualquier ocasión.' },
  { id: 46, nombre: 'Cajas para bombones Litotec', categoria: 'chocolates', precio: 28000, emoji: '🍫', fotos: ['/imagenes/Litotec-Cajas-para-bombones.jpg'], descripcion: 'Cajas elegantes para bombones. Variedad de presentaciones.' },
  { id: 47, nombre: 'Caja suscripción chocolates', categoria: 'chocolates', precio: 58000, emoji: '🍫', fotos: ['/imagenes/lujosa-caja-suscripcion-chocolates.webp'], descripcion: 'Lujosa caja tipo suscripción con chocolates seleccionados. Experiencia gourmet.' },
  { id: 48, nombre: 'Tres cajas corazón', categoria: 'chocolates', precio: 45000, emoji: '❤️', fotos: ['/imagenes/tres-cajas-blancas-chocolates-forma-corazon-chocolates-variados-sobre-fondo-blanco_116578-1874.avif'], descripcion: 'Tres cajas blancas con chocolates en forma de corazón. Set romántico o para regalar a varias personas.' },
  // Globos (imágenes nuevas de la carpeta imagenes)
  { id: 49, nombre: 'Globo burbuja 60 cm transparente', categoria: 'globos', precio: 25000, emoji: '🎈', fotos: ['/imagenes/globo-bubbles-burbuja-60cm-transparente.jpg'], descripcion: 'Globo tipo burbuja transparente de 60 cm. Ideal para rellenar con confeti, peluches o detalles. Decoración para fiestas y eventos.' },
  { id: 50, nombre: 'Globo burbuja', categoria: 'globos', precio: 22000, emoji: '🎈', fotos: ['/imagenes/globo_burbuja3.jpg'], descripcion: 'Globo burbuja para decoración. Perfecto para cumpleaños, baby shower o sorpresas.' },
  { id: 51, nombre: 'Arreglo de globos', categoria: 'globos', precio: 38000, emoji: '🎈', fotos: ['/imagenes/GH308_a8c5728d-f2f5-4f4b-b34b-41d2eb3c8a48.webp'], descripcion: 'Arreglo decorativo de globos. Variedad de colores y estilos para tu celebración.' },
  { id: 52, nombre: 'Bouquet de globos surtidos', categoria: 'globos', precio: 35000, emoji: '🎈', fotos: ['/imagenes/66_0000_WhatsApp-Image-2022-07-06-at-10.48.13-PM.jpg'], descripcion: 'Bouquet de globos surtidos. Ideal para cumpleaños, aniversarios o regalo sorpresa.' },
  { id: 53, nombre: 'Globos decorativos', categoria: 'globos', precio: 28000, emoji: '🎈', fotos: ['/imagenes/Foto-22-9-20-13-02-10-scaled.jpg'], descripcion: 'Set de globos decorativos para fiestas. Colores y tamaños variados.' },
  { id: 54, nombre: 'Globos para fiesta', categoria: 'globos', precio: 32000, emoji: '🎈', fotos: ['/imagenes/IMG_2049_8e70eb66-abe8-4f70-9fa5-ece9d3eb4c9d.jpg'], descripcion: 'Globos para decorar tu fiesta. Cumpleaños, baby shower o evento especial.' },
  { id: 55, nombre: 'Pack globos metálicos', categoria: 'globos', precio: 40000, emoji: '🎈', fotos: ['/imagenes/2a2cb6768c00f3ebdbaba76596470b53.jpg'], descripcion: 'Pack de globos metálicos. Brillantes y elegantes para cualquier celebración.' },
  { id: 56, nombre: 'Globos cumpleaños', categoria: 'globos', precio: 30000, emoji: '🎂', fotos: ['/imagenes/2b60da4a1f33954eb30e2b07d50278fc.jpg'], descripcion: 'Globos temáticos de cumpleaños. Colores y diseños para alegrar la fiesta.' },
  { id: 57, nombre: 'Set globos colores', categoria: 'globos', precio: 26000, emoji: '🎈', fotos: ['/imagenes/35a02a8c30a179a716c7f8c259015f9d.jpg'], descripcion: 'Set de globos en colores variados. Decoración económica y vistosa.' },
  { id: 58, nombre: 'Globos corazón', categoria: 'globos', precio: 32000, emoji: '❤️', fotos: ['/imagenes/459843d98d63ba375571f986affc1102.jpg'], descripcion: 'Globos en forma de corazón. Perfectos para San Valentín o declaración de amor.' },
  { id: 59, nombre: 'Arreglo globos premium', categoria: 'globos', precio: 45000, emoji: '🎈', fotos: ['/imagenes/52a53bdc57c41f8dc63d87a5cc3775d0.jpg'], descripcion: 'Arreglo premium de globos. Presentación lista para regalar o decorar.' },
  { id: 60, nombre: 'Globos sorpresa', categoria: 'globos', precio: 38000, emoji: '🎁', fotos: ['/imagenes/6023b8081767958e8fd2e7792368057a.jpg'], descripcion: 'Globos para arreglos sorpresa. Ideales para cumpleaños o eventos.' },
  // Flores (imágenes nuevas de la carpeta imagenes)
  { id: 61, nombre: '29 rosas con girasoles', categoria: 'flores', precio: 85000, emoji: '🌹', fotos: ['/imagenes/29-rosas-con-girasoles.webp'], descripcion: 'Arreglo con 29 rosas y girasoles. Combinación elegante y alegre para regalar.' },
  { id: 62, nombre: '75 rosas en arreglo floral', categoria: 'flores', precio: 185000, emoji: '🌹', fotos: ['/imagenes/75-Rosas-Rosa-en-Arreglo-Floral.jpg'], descripcion: 'Espectacular arreglo con 75 rosas rosas. Declaración de amor o aniversario.' },
  { id: 63, nombre: 'Arreglo azul y blanco', categoria: 'flores', precio: 72000, emoji: '🌸', fotos: ['/imagenes/Arreglo-Azul-y-Blanco.jpg'], descripcion: 'Arreglo floral en tonos azul y blanco. Fresco y elegante para cualquier ocasión.' },
  { id: 64, nombre: '48 rosas redondo', categoria: 'flores', precio: 95000, emoji: '🌹', fotos: ['/imagenes/Arreglo-de-48-Rosas-Redondo-Floreria-La-Fleur-Buceo-Montevideo-Uruguay_1.jpg'], descripcion: 'Arreglo redondo con 48 rosas. Presentación de floristería, impacto visual.' },
  { id: 65, nombre: 'Arreglo girasoles', categoria: 'flores', precio: 65000, emoji: '🌻', fotos: ['/imagenes/arreglo-de-flores-girasoles-floreriaadomicilio-dot-mx-1.jpg'], descripcion: 'Arreglo con girasoles y flores variadas. Alegría y color a domicilio.' },
  { id: 66, nombre: 'Rosas rosadas y blancas', categoria: 'flores', precio: 78000, emoji: '🌷', fotos: ['/imagenes/arreglo-de-rosas-rosadas-y-blancas.jpg'], descripcion: 'Arreglo de rosas rosadas y blancas. Romántico y delicado.' },
  { id: 67, nombre: 'Rosas y gerberas', categoria: 'flores', precio: 68000, emoji: '🌸', fotos: ['/imagenes/Arreglo-de-Rosas-y-Gerberas-Floreria-La-FLeur-Envio-de-arreglos-florales-flores-y-plantas-de-interior.jpg'], descripcion: 'Arreglo de rosas y gerberas. Flores frescas con envío a domicilio.' },
  { id: 68, nombre: 'Arreglo floral 6', categoria: 'flores', precio: 58000, emoji: '💐', fotos: ['/imagenes/Arreglo-floral-6.jpg'], descripcion: 'Arreglo floral surtido. Ideal para cumpleaños o detalle especial.' },
  { id: 69, nombre: 'Arreglo floral clásico Lemon', categoria: 'flores', precio: 62000, emoji: '🌸', fotos: ['/imagenes/Arreglo-floral-clasico-Lemon.jpg'], descripcion: 'Arreglo floral clásico en tonos limón. Fresco y elegante.' },
  { id: 70, nombre: 'Rosas Casablanca Cherry', categoria: 'flores', precio: 82000, emoji: '🌹', fotos: ['/imagenes/Arreglo-floral-de-Rosas-Casablancas-Cherry.jpg'], descripcion: 'Arreglo con rosas Casablanca y Cherry. Blanco y rojo, sofisticado.' },
  { id: 71, nombre: 'Arreglo gerberas Jade', categoria: 'flores', precio: 55000, emoji: '🌼', fotos: ['/imagenes/Arreglo-floral-Gerberas-Jade.jpg'], descripcion: 'Arreglo con gerberas en tonos jade. Colorido y alegre.' },
  { id: 72, nombre: 'Gerberas Jade (variante)', categoria: 'flores', precio: 52000, emoji: '🌼', fotos: ['/imagenes/Arreglo-floral-Gerberas-Jade (1).jpg'], descripcion: 'Arreglo con gerberas Jade. Perfecto para alegrar cualquier espacio.' },
  { id: 73, nombre: 'Rosas, anturios y gerberas', categoria: 'flores', precio: 92000, emoji: '🌹', fotos: ['/imagenes/Arreglo-floral-Rosas-Anturios-Casblanca-y-Gerberas-Catalina.jpg'], descripcion: 'Arreglo con rosas, anturios Casablanca y gerberas Catalina. Mix premium.' },
  { id: 74, nombre: 'Rosas y gerberas Sophie Pink', categoria: 'flores', precio: 75000, emoji: '🌸', fotos: ['/imagenes/Arreglo-Floral-Rosas-y-Gerberas-Sophie-Pink-1200x1716.jpg'], descripcion: 'Arreglo rosas y gerberas en rosa Sophie. Detalle femenino y delicado.' },
  { id: 75, nombre: 'Arreglo floral variado grande', categoria: 'flores', precio: 105000, emoji: '💐', fotos: ['/imagenes/Arreglo-Floral-Variado-Grande-EnvA_o-de-flores-y-plantas-FlorerA_a-La-Fleur-Montevideo-Uruguay..jpg'], descripcion: 'Arreglo floral variado tamaño grande. Muchas flores para impacto máximo.' },
  { id: 76, nombre: 'Ramos rosas y lilium en florero', categoria: 'flores', precio: 88000, emoji: '🌷', fotos: ['/imagenes/arreglo-rosas-lilium-florero_1.jpg'], descripcion: 'Arreglo de rosas y lilium en florero. Elegante para mesa o regalo.' },
  { id: 77, nombre: 'Bouquet 200 rosas rojas', categoria: 'flores', precio: 285000, emoji: '🌹', fotos: ['/imagenes/Espectacular-Bouquet-de-200-Rosas-rojas.jpg'], descripcion: 'Espectacular bouquet de 200 rosas rojas. Regalo inolvidable.' },
  { id: 78, nombre: 'Caja 25 rosas y variedad', categoria: 'flores', precio: 115000, emoji: '🌹', fotos: ['/imagenes/caja-ovalada-negra-con-25-rosas-tulipanes-ortencias-lisianthus-y-follajes-finos.jpg'], descripcion: 'Caja ovalada negra con 25 rosas, tulipanes, ortencias, lisianthus y follajes. Presentación premium.' },
  { id: 79, nombre: 'Mini cofre 36 rosas', categoria: 'flores', precio: 98000, emoji: '🌹', fotos: ['/imagenes/mini-cofre-rosita-con-36-rosas-perritoshortensias-lisianthus-y-follajes-finos.jpg'], descripcion: 'Mini cofre con 36 rosas, hortensias, lisianthus y follajes. Detalle especial.' },
  { id: 80, nombre: 'Orquídea de un tallo', categoria: 'flores', precio: 45000, emoji: '🦋', fotos: ['/imagenes/Orquidea-de-un-tallo-.jpg'], descripcion: 'Orquídea de un tallo. Elegante y duradera, ideal para regalo o decoración.' },
  { id: 81, nombre: 'Arreglo rosas y girasoles a domicilio', categoria: 'flores', precio: 72000, emoji: '🌻', fotos: ['/imagenes/p_1_4_8_148-Arreglos-Florales-a-Domicilio-Rosas-y-girasoles-Mitu-1.jpg'], descripcion: 'Arreglo floral con rosas y girasoles. Envío a domicilio disponible.' },
  { id: 82, nombre: 'Ramo flores arreglo floral', categoria: 'flores', precio: 58000, emoji: '💐', fotos: ['/imagenes/ramo-flores-arreglo-floral2.webp'], descripcion: 'Ramo de flores surtidas. Arreglo floral listo para regalar.' },
  // Peluches (imágenes nuevas de la carpeta imagenes)
  { id: 83, nombre: 'Peluche V1', categoria: 'peluches', precio: 35000, emoji: '🧸', fotos: ['/imagenes/26_Peluche_V1-min.webp'], descripcion: 'Peluche suave y tierno. Ideal para regalar a niños o como detalle de amor.' },
  { id: 84, nombre: 'Ositos con corazón', categoria: 'peluches', precio: 42000, emoji: '❤️', fotos: ['/imagenes/ositos_corazon-min.jpg'], descripcion: 'Ositos de peluche con detalle de corazón. Perfectos para San Valentín o cumpleaños.' },
  { id: 85, nombre: 'Oso de peluche marrón', categoria: 'peluches', precio: 38000, emoji: '🧸', fotos: ['/imagenes/oso-de-peluche-marron.jpg'], descripcion: 'Oso de peluche marrón clásico. Suave y abrazable, regalo para toda ocasión.' },
  { id: 86, nombre: 'Oso Tus Sorpresas', categoria: 'peluches', precio: 45000, emoji: '🧸', fotos: ['/imagenes/Oso-Tus-Sorpresas.jpg'], descripcion: 'Oso de peluche "Tus Sorpresas". Ideal para acompañar regalos o sorpresas.' },
  { id: 87, nombre: 'Osos peluche en cajas regalo', categoria: 'peluches', precio: 52000, emoji: '🎁', fotos: ['/imagenes/osos-peluche-cajas-regalos_100436-1500.avif'], descripcion: 'Osos de peluche presentados en cajas regalo. Listos para regalar con estilo.' },
  { id: 88, nombre: 'Osito sobre cojín corazón', categoria: 'peluches', precio: 48000, emoji: '❤️', fotos: ['/imagenes/peluche-osito-sobre-cojin-en-forma-de-corazon.jpg'], descripcion: 'Osito de peluche sobre cojín en forma de corazón. Regalo romántico y tierno.' },
  { id: 89, nombre: 'Peluche pareja beso con foto', categoria: 'peluches', precio: 55000, emoji: '💑', fotos: ['/imagenes/peluche-pareja-beso-con-foto-g1.webp'], descripcion: 'Peluche de pareja besándose con espacio para foto. Regalo personalizado para tu amor.' },
  { id: 90, nombre: 'Peluche perro con corazón', categoria: 'peluches', precio: 32000, emoji: '🐕', fotos: ['/imagenes/peluche-perro-con-corazon.jpg'], descripcion: 'Peluche de perro con corazón. Tierno detalle para amantes de los animales.' },
  { id: 91, nombre: 'Peluche regalo para tu novia', categoria: 'peluches', precio: 40000, emoji: '🧸', fotos: ['/imagenes/peluche-regalo-para-su-novia.jpg'], descripcion: 'Peluche ideal como regalo para ella. Suave y con mensaje de amor.' },
  { id: 92, nombre: 'Peluche tierno', categoria: 'peluches', precio: 28000, emoji: '🧸', fotos: ['/imagenes/peluche-tierno_1.webp'], descripcion: 'Peluche tierno y suave. Perfecto para cumpleaños o detalle especial.' },
  { id: 93, nombre: 'Peluches San Valentín', categoria: 'peluches', precio: 45000, emoji: '❤️', fotos: ['/imagenes/Peluches-San-Valentn-640x480.jpg'], descripcion: 'Peluches temáticos San Valentín. Osos y diseños románticos para regalar.' },
  { id: 94, nombre: 'Variedad de peluches', categoria: 'peluches', precio: 35000, emoji: '🧸', fotos: ['/imagenes/peluches.jpg'], descripcion: 'Variedad de peluches para elegir. Diferentes tamaños y diseños.' },
  { id: 95, nombre: 'Oso de peluche marrón (variante)', categoria: 'peluches', precio: 38000, emoji: '🧸', fotos: ['/imagenes/oso-de-peluche-marron (1).jpg'], descripcion: 'Oso de peluche marrón. Suave, abrazable y perfecto para regalar.' }
] satisfies readonly Product[];
