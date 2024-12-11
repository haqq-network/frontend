import type { Fee } from '@evmos/transactions';

export const getMinBigIntAmount = (
  amount: bigint,
  maxAvailableAmount?: bigint,
) => {
  if (!maxAvailableAmount) {
    return amount;
  }

  return amount > maxAvailableAmount ? maxAvailableAmount : amount;
};

export function getAmountIncludeFee(
  amount: number,
  balance: number,
  fee: Fee,
  maxAvailableAmount?: bigint,
) {
  const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
  const bigIntBalance = BigInt(Number(balance) * 10 ** 18);
  const bigIntFeeAmount = BigInt(fee.amount);

  if (bigIntAmount + bigIntFeeAmount > bigIntBalance) {
    return {
      amount: getMinBigIntAmount(
        bigIntAmount - bigIntFeeAmount,
        maxAvailableAmount,
      ).toString(),
      denom: 'aISLM',
    };
  }

  return {
    amount: getMinBigIntAmount(bigIntAmount, maxAvailableAmount).toString(),
    denom: 'aISLM',
  };
}
