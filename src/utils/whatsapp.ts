/**
 * Integración con WhatsApp desde el navegador.
 *
 * Origen del número: primero `data-whatsapp` en <body> (index.html), luego CONFIG del catálogo.
 * Prioriza api.whatsapp.com/send con texto prefabricado (carrito o mensaje de información).
 */
import { CONFIG } from '../data/catalog';

/** Campos mínimos del ítem para armar el texto del pedido (sin fotos ni id). */
export type OrderLine = { nombre: string; quantity: number; precio: number };

/** Un solo timer global para no acumular toasts si hay varios clics seguidos. */
let toastTimer: ReturnType<typeof setTimeout> | undefined;

/** Mensaje multilínea para pegar en WhatsApp: ítems, cantidades y total en COP. */
export function formatWhatsAppOrderText(items: OrderLine[], total: number): string {
  if (items && items.length > 0) {
    let text = CONFIG.orderMessage + '\n\n*Productos que seleccioné:*\n';
    items.forEach((i) => {
      /* Subtotal línea = precio unitario × cantidad (misma moneda que `total` del carrito). */
      text += `• ${i.nombre} x${i.quantity} — $${(i.precio * i.quantity).toLocaleString('es-CO')}\n`;
    });
    text += `\n*Total: $${total.toLocaleString('es-CO')}*`;
    return text;
  }
  return '¡Hola! Me gustaría información sobre los productos de RegaloMágico.';
}

/** Prioriza `data-whatsapp` en body para poder cambiar número sin rebuild si solo editas index.html. */
function getWhatsAppPhoneDigits(): string {
  const fromDom = (document.body?.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
  if (fromDom) return fromDom;
  return String(CONFIG.whatsappNumber || '').replace(/\D/g, '');
}

/** Los links tipo QR no llevan bien parámetro `text` en escritorio — tratamiento especial abajo. */
function isWhatsAppQrLink(link: string): boolean {
  return /wa\.me\/qr\//i.test(link) || /api\.whatsapp\.com\/.*\/qr\//i.test(link);
}

/** Aviso no modal cuando hay que copiar/pegar el pedido manualmente (flujo QR en PC). */
function showWhatsAppToast(message: string): void {
  let el = document.getElementById('whatsapp-toast');
  if (!el) {
    /* No está en index.html: lo creamos solo cuando hace falta UX de copiar/pegar en escritorio. */
    el = document.createElement('div');
    el.id = 'whatsapp-toast';
    el.setAttribute('role', 'status');
    el.style.cssText =
      'position:fixed;bottom:96px;left:50%;transform:translateX(-50%);' +
      'background:#1a3328;color:#fff;padding:14px 20px;border-radius:12px;' +
      'z-index:10001;max-width:min(420px,92vw);font-size:14px;line-height:1.4;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.28);text-align:center;';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.display = 'block';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el!.style.display = 'none';
  }, 6000);
}

/**
 * 1) Si hay dígitos de teléfono → api.whatsapp.com/send con texto.
 * 2) Si hay CONFIG link normal → mismo destino con `text=` añadido.
 * 3) Si solo QR → clipboard/toast en flujo pedido o mensaje de ayuda.
 */
export async function openWhatsAppWithText(
  message: string,
  options: { orderFlow?: boolean } = {}
): Promise<void> {
  const { orderFlow = false } = options;
  const link = CONFIG.whatsappLink ? String(CONFIG.whatsappLink) : '';
  const num = getWhatsAppPhoneDigits();

  // Mejor caso: tenemos dígitos → enlace api.whatsapp.com con mensaje prellenado.
  if (num) {
    const sendUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(message)}`;
    window.open(sendUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Solo CONFIG: si no es URL de QR, se puede añadir ?text= o &text= al vuelo.
  if (link && !isWhatsAppQrLink(link)) {
    const sep = link.includes('?') ? '&' : '?';
    window.open(`${link}${sep}text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    return;
  }

  // Link tipo QR: en escritorio suele fallar abrir con texto; pedimos copiar o guiar al usuario.
  if (link && isWhatsAppQrLink(link)) {
    if (orderFlow) {
      try {
        await navigator.clipboard.writeText(message);
        showWhatsAppToast(
          'Pedido copiado. En PC el link QR de WhatsApp falla: abre web.whatsapp.com y pega el mensaje.'
        );
      } catch {
        showWhatsAppToast('Copia el pedido a mano y envíalo por WhatsApp Web o el móvil.');
      }
    } else {
      showWhatsAppToast('En computador evita el enlace QR; usa WhatsApp Web o un link con tu número.');
    }
    return;
  }

  // Sin número ni link usable: fallback al número por defecto del proyecto (debería coincidir con producción).
  window.open('https://api.whatsapp.com/send?phone=573143562274', '_blank', 'noopener,noreferrer');
}
