// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from 'react';
import { useContractRead, usePublicClient } from 'wagmi';
import { HaqqVestingContract } from '../components/DepositStatsWidget/DepositStatsWidget';

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
  depositsCount: undefined | bigint;
  address: `0x${string}`;
  contractAddress: `0x${string}`;
  depositId: bigint;
}): Deposit | undefined {
  const publicClient = usePublicClient();
  const { data: depositContract, isLoading: isLoadingDepositContract } =
    useContractRead({
      address: contractAddress,
      abi: HaqqVestingContract.abi,
      publicClient,
      functionName: 'deposits',
      args: [address, depositId],
      watch: true,
    });
  const { data: amountToWithdrawNow, isLoading: isLoadingAmountToWithdrawNow } =
    useContractRead({
      address: contractAddress,
      abi: HaqqVestingContract.abi,
      publicClient,
      functionName: 'amountToWithdrawNow',
      args: [address, depositId],
      watch: true,
    });
  const { data: timeBetweenPayments, isLoading: isLoadingTimeBetweenPayments } =
    useContractRead({
      address: contractAddress,
      abi: HaqqVestingContract.abi,
      publicClient,
      functionName: 'TIME_BETWEEN_PAYMENTS',
      watch: true,
    });

  return useMemo(() => {
    if (
      depositsCount === 0 ||
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
      unlockPeriod: timeBetweenPayments,
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
