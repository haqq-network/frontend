export function formatNumber(
  numberToFormat: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
) {
  return numberToFormat.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
