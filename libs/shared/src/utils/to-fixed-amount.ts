export function toFixedAmount(val: number | undefined, fractionDigits = 5) {
  return val ? Number.parseFloat(val.toFixed(fractionDigits)) : val;
}
