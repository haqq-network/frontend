export function formatNumber(
  numberToFormat: number,
  maximumFractionDigits = 2,
) {
  return numberToFormat.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}
