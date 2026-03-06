'use client';

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { UcdaoAbi } from '../abi/ucdao';
import { UCDAO_PRECOMPILE_ADDRESS } from '../constants/ucdao-config';

/**
 * Hook to call convertToHaqq(sender, receiver, islmAmount) on the UCDAO precompile.
 * Converts ISLM to HAQQ for the given sender/receiver.
 */
export function useUcdaoConvertToHaqq() {
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
    chainId,
  });

  const convertToHaqq = async (
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
      address: UCDAO_PRECOMPILE_ADDRESS,
      abi: UcdaoAbi,
      functionName: 'convertToHaqq',
      args: [sender, receiver, islmAmount],
      chainId,
    });
  };

  return {
    convertToHaqq,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to call transferOwnership(owner, newOwner) on the UCDAO precompile.
 * Transfers ownership of all DAO balances to a new owner.
 */
export function useUcdaoTransferOwnership() {
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
    chainId,
  });

  const transferOwnership = async (
    owner: `0x${string}`,
    newOwner: `0x${string}`,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: UCDAO_PRECOMPILE_ADDRESS,
      abi: UcdaoAbi,
      functionName: 'transferOwnership',
      args: [owner, newOwner],
      chainId,
    });
  };

  return {
    transferOwnership,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to call transferOwnershipWithAmount(owner, newOwner, islmAmount) on the UCDAO precompile.
 * Transfers ownership with a specific ISLM amount to a new owner.
 */
export function useUcdaoTransferOwnershipWithAmount() {
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
    chainId,
  });

  const transferOwnershipWithAmount = async (
    owner: `0x${string}`,
    newOwner: `0x${string}`,
    islmAmount: bigint,
  ) => {
    if (!writeContractAsync) {
      throw new Error('Wallet not connected');
    }

    if (!chainId) {
      throw new Error('Chain ID not available');
    }

    return writeContractAsync({
      address: UCDAO_PRECOMPILE_ADDRESS,
      abi: UcdaoAbi,
      functionName: 'transferOwnershipWithAmount',
      args: [owner, newOwner, islmAmount],
      chainId,
    });
  };

  return {
    transferOwnershipWithAmount,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
