import { CONFIG } from '../data/catalog';

export type OrderLine = { nombre: string; quantity: number; precio: number };

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function formatWhatsAppOrderText(items: OrderLine[], total: number): string {
  if (items && items.length > 0) {
    let text = CONFIG.orderMessage + '\n\n*Productos que seleccioné:*\n';
    items.forEach((i) => {
      text += `• ${i.nombre} x${i.quantity} — $${(i.precio * i.quantity).toLocaleString('es-CO')}\n`;
    });
    text += `\n*Total: $${total.toLocaleString('es-CO')}*`;
    return text;
  }
  return '¡Hola! Me gustaría información sobre los productos de RegaloMágico.';
}

function getWhatsAppPhoneDigits(): string {
  const fromDom = (document.body?.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
  if (fromDom) return fromDom;
  return String(CONFIG.whatsappNumber || '').replace(/\D/g, '');
}

function isWhatsAppQrLink(link: string): boolean {
  return /wa\.me\/qr\//i.test(link) || /api\.whatsapp\.com\/.*\/qr\//i.test(link);
}

function showWhatsAppToast(message: string): void {
  let el = document.getElementById('whatsapp-toast');
  if (!el) {
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

export async function openWhatsAppWithText(
  message: string,
  options: { orderFlow?: boolean } = {}
): Promise<void> {
  const { orderFlow = false } = options;
  const link = CONFIG.whatsappLink ? String(CONFIG.whatsappLink) : '';
  const num = getWhatsAppPhoneDigits();

  if (num) {
    const sendUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(message)}`;
    window.open(sendUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  if (link && !isWhatsAppQrLink(link)) {
    const sep = link.includes('?') ? '&' : '?';
    window.open(`${link}${sep}text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    return;
  }

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

  window.open('https://api.whatsapp.com/send?phone=573143562274', '_blank', 'noopener,noreferrer');
}
