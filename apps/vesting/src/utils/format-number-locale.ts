export function formatLocaleNumber(value?: number) {
  if (value === undefined) {
    return undefined;
  }

  return value.toLocaleString(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}
