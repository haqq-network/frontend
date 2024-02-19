export function formatNumber(
  numberToFormat: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 3,
) {
  return numberToFormat.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
