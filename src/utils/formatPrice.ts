/** Formato monetario simple para COP (prefijo $ + separadores es-CO). No usa Intl.currency por compatibilidad mínima. */
export function formatPriceCOP(value: number | string | undefined | null): string {
  /* '' o null → 0; strings numéricos también se convierten (evita NaN en UI). */
  return `$${Number(value || 0).toLocaleString('es-CO')}`;
}
