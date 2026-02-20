import { formatEthDecimal } from '@haqq/shell-shared';

export interface FormatWaitlistPriceOptions {
  /** Decimal places for display (when value is already decimal) */
  precision?: number;
  /** When treating as atto, the decimals to divide by (0 = already in smallest unit) */
  fromDecimals?: number;
}

/** Trim trailing zeros after the decimal point (e.g. "3.00" -> "3", "8.50" -> "8.5"). */
function trimTrailingZeros(s: string): string {
  if (!s.includes('.')) return s;
  return s.replace(/\.?0+$/, '');
}

/**
 * Format waitlist price for display. Supports:
 * - String: decimal (e.g. "3.00") or atto integer string
 * - Number: decimal (e.g. 8.5) or integer atto when asAtto is true
 * Trailing zeros after the decimal are trimmed.
 */
export function formatWaitlistPrice(
  value: string | number,
  options?: FormatWaitlistPriceOptions & { asAtto?: boolean },
): string {
  const precision = options?.precision ?? 2;
  const fromDecimals = options?.fromDecimals ?? 0;

  let result: string;
  if (typeof value === 'string') {
    if (value.includes('.')) {
      const n = Number(value);
      result = Number.isFinite(n) ? n.toFixed(precision) : value;
    } else {
      try {
        result = formatEthDecimal(BigInt(value), precision, fromDecimals);
      } catch {
        return value;
      }
    }
  } else {
    if (value <= 0) result = value.toFixed(precision);
    else if (options?.asAtto && Number.isInteger(value)) {
      result = formatEthDecimal(BigInt(value), precision, fromDecimals);
    } else {
      result = value.toFixed(precision);
    }
  }
  return trimTrailingZeros(result);
}
