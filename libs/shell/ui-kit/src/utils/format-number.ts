export function formatNumber(
  numberToFormat: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 3,
  locale = 'en-US',
) {
  return numberToFormat.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
