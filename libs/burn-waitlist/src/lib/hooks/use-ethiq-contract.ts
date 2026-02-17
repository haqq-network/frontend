'use client';

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { EthiqAbi } from '../abi/ethiq';
import { ETHIQ_PRECOMPILE_ADDRESS } from '../constants/ethiq-config';
import { WAITLIST_DEFAULT_CHAIN_ID } from '../constants/waitlist-config';

/**
 * Hook to call calculate(islmAmount) on the Ethiq precompile.
 * Returns estimated HAQQ amount, supply before/after, and price per unit.
 */
export function useEthiqCalculate(islmAmount?: bigint) {
  const { chain } = useAccount();
  const chainId = chain?.id || WAITLIST_DEFAULT_CHAIN_ID;

  const { data, isLoading, error, refetch } = useReadContract({
    address: ETHIQ_PRECOMPILE_ADDRESS,
    abi: EthiqAbi,
    functionName: 'calculate',
    args: islmAmount !== undefined ? [islmAmount] : undefined,
    chainId,
    query: {
      enabled: islmAmount !== undefined && islmAmount > 0n,
    },
  });

  const result = data as [bigint, bigint, bigint, string] | undefined;

  console.log('result', result, error);

  return {
    estimatedHaqqAmount: result?.[0],
    supplyBefore: result?.[1],
    supplyAfter: result?.[2],
    pricePerUnit: result?.[3],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to call mintHaqq(sender, receiver, islmAmount) on the Ethiq precompile.
 * Used by regular users (not in waitlist) to burn ISLM and mint HAQQ.
 */
export function useMintHaqq() {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const mintHaqq = async (
    sender: `0x${string}`,
    receiver: `0x${string}`,
    islmAmount: bigint,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: ETHIQ_PRECOMPILE_ADDRESS,
      abi: EthiqAbi,
      functionName: 'mintHaqq',
      args: [sender, receiver, islmAmount],
      chainId,
    });
  };

  return {
    mintHaqq,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to call mintHaqqByApplication(sender, receiver, applicationId) on the Ethiq precompile.
 * Used by waitlist participants to mint HAQQ for their approved applications.
 */
export function useMintHaqqByApplication() {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const mintHaqqByApplication = async (
    sender: `0x${string}`,
    receiver: `0x${string}`,
    applicationId: bigint,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: ETHIQ_PRECOMPILE_ADDRESS,
      abi: EthiqAbi,
      functionName: 'mintHaqqByApplication',
      args: [sender, receiver, applicationId],
      chainId,
    });
  };

  return {
    mintHaqqByApplication,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
