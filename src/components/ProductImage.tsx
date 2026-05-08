import { useState } from 'react';
import type { Product } from '../data/catalog';
import { publicUrl } from '../utils/publicUrl';

type Props = {
  product: Product;
  className?: string;
};

/** Miniatura / modal: primera foto con `publicUrl`, o emoji si la imagen falla. */
export function ProductImage({ product, className = '' }: Props) {
  const [broken, setBroken] = useState(false);
  const src = product.fotos?.[0] ? publicUrl(product.fotos[0]) : '';
  if (!src || broken) {
    return <span className={`img-fallback ${className}`.trim()}>{product.emoji || '🎁'}</span>;
  }
  return (
    <img
      className={className}
      src={src}
      alt={product.nombre || ''}
      onError={() => setBroken(true)}
    />
  );
}
