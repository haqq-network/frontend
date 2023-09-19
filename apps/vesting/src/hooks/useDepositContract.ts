import { useMemo } from 'react';
import { useContractRead } from 'wagmi';
import HaqqVestingContract from '../../HaqqVesting.json';

export interface Deposit {
  locked: bigint;
  unlocked: bigint;
  available: bigint;
  deposited: bigint;
  withdrawn: bigint;
  createdAt: string;
  unlockPeriod: number;
}

export function useDepositContract({
  depositsCount,
  address,
  depositId,
  contractAddress,
}: {
  depositsCount: undefined | number;
  address: `0x${string}`;
  contractAddress: `0x${string}`;
  depositId: number;
}): Deposit | undefined {
  const { data: depositContract, isLoading: isLoadingDepositContract } =
    useContractRead<
      typeof HaqqVestingContract.abi,
      'deposits',
      [bigint, bigint, bigint]
    >({
      address: contractAddress,
      abi: HaqqVestingContract.abi,
      functionName: 'deposits',
      args: [address, depositId],
      watch: true,
    });
  const { data: amountToWithdrawNow, isLoading: isLoadingAmountToWithdrawNow } =
    useContractRead<
      typeof HaqqVestingContract.abi,
      'amountToWithdrawNow',
      bigint
    >({
      address: contractAddress,
      abi: HaqqVestingContract.abi,
      functionName: 'amountToWithdrawNow',
      args: [address, depositId],
      watch: true,
    });
  const { data: timeBetweenPayments, isLoading: isLoadingTimeBetweenPayments } =
    useContractRead<
      typeof HaqqVestingContract.abi,
      'TIME_BETWEEN_PAYMENTS',
      bigint
    >({
      address: contractAddress,
      abi: HaqqVestingContract.abi,
      functionName: 'TIME_BETWEEN_PAYMENTS',
      watch: true,
    });

  return useMemo(() => {
    if (
      (depositsCount && Number.parseInt(depositsCount.toString()) === 0) ||
      isLoadingDepositContract ||
      isLoadingAmountToWithdrawNow ||
      isLoadingTimeBetweenPayments ||
      depositContract === undefined ||
      amountToWithdrawNow === undefined ||
      timeBetweenPayments === undefined
    ) {
      return undefined;
    }

    const available = amountToWithdrawNow;
    const [timestamp, sumInWeiDeposited, sumPaidAlready] = depositContract;
    const deposited = sumInWeiDeposited;
    const withdrawn = sumPaidAlready;
    const unlocked = BigInt(sumPaidAlready) + BigInt(available);
    const locked = deposited - unlocked;

    return {
      locked,
      unlocked,
      available,
      deposited,
      withdrawn,
      createdAt: new Date(Number(timestamp) * 1000).toISOString(),
      unlockPeriod: Number.parseFloat(timeBetweenPayments.toString()),
    };
  }, [
    amountToWithdrawNow,
    depositContract,
    depositsCount,
    isLoadingAmountToWithdrawNow,
    isLoadingDepositContract,
    isLoadingTimeBetweenPayments,
    timeBetweenPayments,
  ]);
}
