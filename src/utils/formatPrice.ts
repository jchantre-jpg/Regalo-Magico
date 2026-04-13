export function formatPriceCOP(value: number | string | undefined | null): string {
  return `$${Number(value || 0).toLocaleString('es-CO')}`;
}
