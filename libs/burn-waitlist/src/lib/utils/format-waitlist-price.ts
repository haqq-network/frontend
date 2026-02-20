import { formatEthDecimal } from '@haqq/shell-shared';

export interface FormatWaitlistPriceOptions {
  /** Decimal places for display (when value is already decimal) */
  precision?: number;
  /** When treating as atto, the decimals to divide by (0 = already in smallest unit) */
  fromDecimals?: number;
}

/**
 * Format waitlist price for display. Supports:
 * - String: decimal (e.g. "3.00") or atto integer string
 * - Number: decimal (e.g. 8.5) or integer atto when asAtto is true
 */
export function formatWaitlistPrice(
  value: string | number,
  options?: FormatWaitlistPriceOptions & { asAtto?: boolean },
): string {
  const precision = options?.precision ?? 2;
  const fromDecimals = options?.fromDecimals ?? 0;

  if (typeof value === 'string') {
    if (value.includes('.')) {
      const n = Number(value);
      return Number.isFinite(n) ? n.toFixed(precision) : value;
    }
    try {
      return formatEthDecimal(BigInt(value), precision, fromDecimals);
    } catch {
      return value;
    }
  }

  // number
  if (value <= 0) return value.toFixed(precision);
  if (options?.asAtto && Number.isInteger(value)) {
    return formatEthDecimal(BigInt(value), precision, fromDecimals);
  }
  return value.toFixed(precision);
}
