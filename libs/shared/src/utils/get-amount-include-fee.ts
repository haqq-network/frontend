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
  amount: bigint,
  balance: bigint,
  fee: Fee,
  maxAvailableAmount?: bigint,
) {
  const bigIntAmount = amount;
  const bigIntBalance = balance;
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
