import type { Fee } from '@evmos/transactions';

export function getAmountAndDenom(amount: number, fee?: Fee) {
  // Multiply the amount by 10^18 and convert it to BigInt
  const bigIntAmount = BigInt(amount) * BigInt(10 ** 18);

  const finalAmount = fee ? bigIntAmount + BigInt(fee.amount) : bigIntAmount;

  return {
    amount: finalAmount.toString(),
    denom: 'aISLM',
  };
}
