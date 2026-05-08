import type { MouseEvent } from 'react';
import { CONFIG } from '../data/catalog';
import { WhatsAppIcon } from './WhatsAppIcon';

type Props = {
  onWhatsAppClick: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function ContactSection({ onWhatsAppClick }: Props) {
  return (
    <section className="section contact" id="contacto">
      <div className="container">
        <h2 className="section-title">Contacto</h2>
        <div className="contact-content">
          <div className="contact-info">
            <p><strong>¿Dudas? ¿Productos personalizados?</strong></p>
            <p>Escríbenos por WhatsApp, estamos para ayudarte.</p>
            <a
              href={CONFIG.whatsappLink}
              className="btn btn-whatsapp"
              id="contact-whatsapp"
              onClick={onWhatsAppClick}
            >
              <WhatsAppIcon size={24} />
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
