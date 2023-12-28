export function toNewFixedAmount(val: number | undefined, fractionDigits = 3) {
  const systemLocale = navigator.language || 'en-US';

  return val && val > 0.1
    ? val.toLocaleString(systemLocale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })
    : val?.toFixed(18);
}
