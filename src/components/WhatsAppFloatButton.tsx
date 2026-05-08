import type { MouseEvent } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

type Props = {
  whatsappHref: string;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function WhatsAppFloatButton({ whatsappHref, onClick }: Props) {
  return (
    <a
      href={whatsappHref}
      className="whatsapp-float"
      id="whatsapp-float"
      aria-label="Contactar por WhatsApp"
      onClick={onClick}
    >
      <WhatsAppIcon />
      <span>Pedir por WhatsApp</span>
    </a>
  );
}
