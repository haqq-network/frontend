'use client';

import { useCallback } from 'react';
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { useConnectorType, useSafeExecutionWaiter } from '@haqq/shell-shared';
import { UcdaoAbi } from '../abi/ucdao';
import { UCDAO_PRECOMPILE_ADDRESS } from '../constants/ucdao-config';

export const UCDAO_MSG_CONVERT_TO_HAQQ = '/haqq.ucdao.v1.MsgConvertToHaqq';

/**
 * Hook to read the current allowance for a given UCDAO method.
 * Used to check if Safe approval is needed before convertToHaqq.
 */
export function useUcdaoAllowance(
  method: string,
  granteeAddress?: `0x${string}`,
) {
  const { address, chain } = useAccount();
  const { isSafe } = useConnectorType();
  const chainId = chain?.id;

  const effectiveGrantee = granteeAddress || address;

  const { data, isLoading, refetch } = useReadContract({
    address: UCDAO_PRECOMPILE_ADDRESS,
    abi: UcdaoAbi,
    functionName: 'allowance',
    args:
      effectiveGrantee && address
        ? [address, effectiveGrantee, method]
        : undefined,
    chainId,
    query: {
      enabled: Boolean(effectiveGrantee && address && isSafe && chainId),
    },
  });

  const allowance = data as bigint | undefined;

  console.log('useUcdaoAllowance', {
    method,
    grantee: effectiveGrantee,
    granter: address,
    isSafe,
    allowance: allowance?.toString(),
  });

  return {
    allowance,
    isLoading,
    refetch,
    isSafe,
  };
}

/**
 * Shared base for UCDAO write hooks. Handles approve + write contract + receipt tracking.
 * For Safe wallets, polls the Safe SDK for transaction execution status.
 */
function useUcdaoBase(method: string) {
  const { chain } = useAccount();
  const { isSafe, waitForSafeExecution } = useSafeExecutionWaiter();
  const chainId = chain?.id;

  const {
    writeContractAsync: writeApproveAsync,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();

  const {
    writeContractAsync,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId,
  });

  const approve = useCallback(
    async (grantee: `0x${string}`, amount: bigint) => {
      if (!writeApproveAsync) {
        throw new Error('Wallet not connected');
      }
      if (!chainId) {
        throw new Error('Chain ID not available');
      }

      console.log('ucdao approve', {
        method,
        grantee,
        amount: amount.toString(),
      });

      const txHash = await writeApproveAsync({
        address: UCDAO_PRECOMPILE_ADDRESS,
        abi: UcdaoAbi,
        functionName: 'approve',
        args: [grantee, amount, [method]],
        chainId,
      });

      console.log('ucdao approve tx sent', { method, txHash });

      if (isSafe) {
        const executedHash = await waitForSafeExecution(txHash, 30, 1500);
        console.log('ucdao approve Safe tx executed', { method, executedHash });
      }

      return txHash;
    },
    [writeApproveAsync, chainId, method, isSafe, waitForSafeExecution],
  );

  return {
    writeContractAsync,
    chainId,
    isSafe,
    waitForSafeExecution,
    approve,
    isApproving,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error: approveError || writeError,
  };
}

/**
 * Hook to call convertToHaqq(sender, receiver, islmAmount) on the UCDAO precompile.
 * Converts ISLM to HAQQ for the given sender/receiver. For Safe users, approve
 * and convert are separate steps controlled by the UI.
 */
export function useUcdaoConvertToHaqq() {
  const { writeContractAsync, chainId, isSafe, waitForSafeExecution, ...base } =
    useUcdaoBase(UCDAO_MSG_CONVERT_TO_HAQQ);

  const convertToHaqq = useCallback(
    async (
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

      console.log('convertToHaqq', {
        sender,
        receiver,
        amount: islmAmount.toString(),
      });

      const txHash = await writeContractAsync({
        address: UCDAO_PRECOMPILE_ADDRESS,
        abi: UcdaoAbi,
        functionName: 'convertToHaqq',
        args: [sender, receiver, islmAmount],
        chainId,
      });

      if (isSafe) {
        const executedHash = await waitForSafeExecution(txHash, 30, 1500);
        console.log('convertToHaqq Safe tx executed', { executedHash });
      }

      return txHash;
    },
    [writeContractAsync, chainId, isSafe, waitForSafeExecution],
  );

  return { ...base, isSafe, convertToHaqq };
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
 * Hook to call transferOwnershipWithAmount(owner, newOwner, denoms, amounts) on the UCDAO precompile.
 * Transfers ownership with specific denom/amount pairs to a new owner.
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
    denoms: readonly string[],
    amounts: readonly bigint[],
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
      args: [owner, newOwner, denoms, amounts],
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
