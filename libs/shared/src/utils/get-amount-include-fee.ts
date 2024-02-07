import type { Fee } from '@evmos/transactions';

export function getAmountIncludeFee(amount: number, balance: number, fee: Fee) {
  const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
  const bigIntBalance = BigInt(Number(balance) * 10 ** 18);
  const bigIntFeeAmount = BigInt(fee.amount);

  if (bigIntAmount + bigIntFeeAmount > bigIntBalance) {
    return {
      amount: (bigIntAmount - bigIntFeeAmount).toString(),
      denom: 'aISLM',
    };
  }

  return {
    amount: bigIntAmount.toString(),
    denom: 'aISLM',
  };
}
