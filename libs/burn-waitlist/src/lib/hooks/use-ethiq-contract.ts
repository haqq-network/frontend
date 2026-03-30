'use client';

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { useConnectorType } from '@haqq/shell-shared';
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
 * Hook to call calculateForApplication(applicationId) on the Ethiq precompile.
 * Returns estimated HAQQ amount, supply before/after, price per unit, and receiver.
 */
export function useEthiqCalculateForApplication(applicationId?: bigint) {
  const { chain } = useAccount();
  const chainId = chain?.id || WAITLIST_DEFAULT_CHAIN_ID;

  const { data, isLoading, error, refetch } = useReadContract({
    address: ETHIQ_PRECOMPILE_ADDRESS,
    abi: EthiqAbi,
    functionName: 'calculateForApplication',
    args: applicationId !== undefined ? [applicationId] : undefined,
    chainId,
    query: {
      enabled: applicationId !== undefined,
    },
  });

  const result = data as
    | [bigint, bigint, bigint, string, `0x${string}`]
    | undefined;

  return {
    estimatedHaqqAmount: result?.[0],
    supplyBefore: result?.[1],
    supplyAfter: result?.[2],
    pricePerUnit: result?.[3],
    receiver: result?.[4],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to call mintHaqq(sender, receiver, islmAmount) on the Ethiq precompile.
 * Used by regular users (not in waitlist) to burn ISLM and mint HAQQ.
 * Calls approve before mint to grant the Safe authorization.
 */
export function useMintHaqq() {
  const { chain } = useAccount();
  const { isSafe } = useConnectorType();
  const chainId = chain?.id;

  const { writeContractAsync: writeApproveAsync, isPending: isApproving } =
    useWriteContract();

  const {
    writeContractAsync,
    data: hash,
    isPending: isMintPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const isPending = isApproving || isMintPending;

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

    // In Safe context, approve the Safe to execute MintHaqq first
    if (isSafe && writeApproveAsync) {
      await writeApproveAsync({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'approve',
        args: [sender, islmAmount, ['/haqq.ethiq.v1.MsgMintHaqq']],
        chainId,
      });
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
 * Hook to call mintHaqqByApplication(sender, applicationId) on the Ethiq precompile.
 * Used by waitlist participants to mint HAQQ for their approved applications.
 * Calls approve before mint to grant the Safe authorization.
 */
export function useMintHaqqByApplication() {
  const { chain } = useAccount();
  const { isSafe } = useConnectorType();
  const chainId = chain?.id;

  const { writeContractAsync: writeApproveAsync, isPending: isApproving } =
    useWriteContract();

  const {
    writeContractAsync,
    data: hash,
    isPending: isMintPending,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const isPending = isApproving || isMintPending;

  const mintHaqqByApplication = async (
    sender: `0x${string}`,
    applicationId: bigint,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    console.log('mintHaqqByApplication', sender, applicationId);

    // In Safe context, approve the Safe to execute MintHaqqByApplication first
    if (isSafe && writeApproveAsync) {
      await writeApproveAsync({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'approve',
        args: [
          sender,
          applicationId,
          ['/haqq.ethiq.v1.MsgMintHaqqByApplication'],
        ],
        chainId,
      });
    }

    return writeContractAsync({
      address: ETHIQ_PRECOMPILE_ADDRESS,
      abi: EthiqAbi,
      functionName: 'mintHaqqByApplication',
      args: [sender, applicationId],
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
