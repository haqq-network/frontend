export function toFixedAmount(val: number | undefined, fractionDigits = 5) {
  if (val === undefined) {
    return undefined;
  }

  return Number.parseFloat(val.toFixed(fractionDigits));
}
