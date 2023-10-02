import { formatUnits } from 'viem';

export function getAmount(amount: number) {
  return formatUnits(BigInt(amount * 10 ** 18), 0);
}
