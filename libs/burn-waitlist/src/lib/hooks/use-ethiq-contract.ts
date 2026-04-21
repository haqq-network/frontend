'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Hash } from 'viem';
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { useConnectorType, useSafeExecutionWaiter } from '@haqq/shell-shared';
import { EthiqAbi } from '../abi/ethiq';
import { ETHIQ_PRECOMPILE_ADDRESS } from '../constants/ethiq-config';
import { WAITLIST_DEFAULT_CHAIN_ID } from '../constants/waitlist-config';

const ETHIQ_MSG_MINT_HAQQ = '/haqq.ethiq.v1.MsgMintHaqq';
const ETHIQ_MSG_MINT_HAQQ_BY_APPLICATION =
  '/haqq.ethiq.v1.MsgMintHaqqByApplication';

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
 * Hook to read the current allowance for a given Ethiq method.
 * Used to check if Safe approval is needed before minting.
 *
 * @param method - The Ethiq message type to check allowance for
 * @param granteeAddress - Optional grantee address. If provided, checks allowance(grantee, connectedAddress, method).
 *                         If omitted, uses the connected address for both grantee and granter (legacy behavior).
 */
export function useEthiqAllowance(
  method: string,
  granteeAddress?: `0x${string}`,
) {
  const { address, chain } = useAccount();
  const { isSafe } = useConnectorType();
  const chainId = chain?.id || WAITLIST_DEFAULT_CHAIN_ID;

  const effectiveGrantee = granteeAddress || address;

  const { data, isLoading, refetch } = useReadContract({
    address: ETHIQ_PRECOMPILE_ADDRESS,
    abi: EthiqAbi,
    functionName: 'allowance',
    args:
      effectiveGrantee && address
        ? [address, effectiveGrantee, method]
        : undefined,
    chainId,
    query: {
      enabled: Boolean(effectiveGrantee && address && isSafe),
    },
  });

  const allowance = data as bigint | undefined;

  console.log('useEthiqAllowance', {
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
 * Shared base for Ethiq mint hooks. Handles approve + write contract + receipt tracking.
 * For Safe wallets, polls the Safe SDK for transaction execution status.
 */
function useEthiqMintBase(method: string) {
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
    isPending: isMintPending,
    error: mintError,
  } = useWriteContract();

  // For Safe wallets, wagmi's `hash` is the safeTxHash — the real on-chain tx
  // hash only becomes available after the Safe app executes the queued tx.
  // Track it separately so useWaitForTransactionReceipt watches a hash that
  // actually has a receipt.
  const [safeExecutedHash, setSafeExecutedHash] = useState<Hash | undefined>(
    undefined,
  );
  const [isSafeExecuting, setIsSafeExecuting] = useState(false);

  // Clear stale executed hash when a fresh write starts.
  useEffect(() => {
    setSafeExecutedHash(undefined);
  }, [hash]);

  const receiptHash = isSafe ? safeExecutedHash : hash;

  const { isLoading: isReceiptLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: receiptHash,
      chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
    });

  const isConfirming = isSafeExecuting || isReceiptLoading;

  const trackSafeMintExecution = useCallback(
    async (safeTxHash: Hash) => {
      if (!isSafe) {
        return;
      }
      setIsSafeExecuting(true);
      try {
        const executedHash = await waitForSafeExecution(safeTxHash, 30, 1500);
        if (executedHash) {
          setSafeExecutedHash(executedHash);
        }
      } finally {
        setIsSafeExecuting(false);
      }
    },
    [isSafe, waitForSafeExecution],
  );

  const approve = useCallback(
    async (sender: `0x${string}`, amount: bigint) => {
      if (!writeApproveAsync) {
        throw new Error('Wallet not connected');
      }
      if (!chainId) {
        throw new Error('Chain ID not available');
      }

      console.log('approve', { method, sender, amount: amount.toString() });

      const txHash = await writeApproveAsync({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'approve',
        args: [sender, amount, [method]],
        chainId,
      });

      console.log('approve tx sent', { method, txHash });

      if (isSafe) {
        const executedHash = await waitForSafeExecution(txHash, 30, 1500);
        console.log('approve Safe tx executed', { method, executedHash });
      }

      return txHash;
    },
    [writeApproveAsync, chainId, method, isSafe, waitForSafeExecution],
  );

  const approveByApplicationId = useCallback(
    async (sender: `0x${string}`, applicationId: bigint) => {
      if (!writeApproveAsync) {
        throw new Error('Wallet not connected');
      }
      if (!chainId) {
        throw new Error('Chain ID not available');
      }

      console.log('approveByApplicationId', {
        method,
        sender,
        applicationId: applicationId.toString(),
      });

      const txHash = await writeApproveAsync({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'approveApplicationID',
        args: [sender, applicationId, [method]],
        chainId,
      });

      console.log('approveByApplicationId tx sent', { method, txHash });

      if (isSafe) {
        const executedHash = await waitForSafeExecution(txHash, 30, 1500);
        console.log('approveByApplicationId Safe tx executed', {
          method,
          executedHash,
        });
      }

      return txHash;
    },
    [writeApproveAsync, chainId, method, isSafe, waitForSafeExecution],
  );

  return {
    writeContractAsync,
    chainId,
    isSafe,
    trackSafeMintExecution,
    approve,
    approveByApplicationId,
    isApproving,
    hash,
    isPending: isMintPending,
    isConfirming,
    isSuccess,
    error: approveError || mintError,
  };
}

/**
 * Hook to burn ISLM and mint HAQQ via the Ethiq precompile.
 * For Safe users, approve and mint are separate steps controlled by the UI.
 */
export function useMintHaqq() {
  const {
    writeContractAsync,
    chainId,
    isSafe,
    trackSafeMintExecution,
    ...base
  } = useEthiqMintBase(ETHIQ_MSG_MINT_HAQQ);

  const mintHaqq = useCallback(
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

      console.log('mintHaqq', {
        sender,
        receiver,
        amount: islmAmount.toString(),
      });

      const txHash = await writeContractAsync({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'mintHaqq',
        args: [sender, receiver, islmAmount],
        chainId,
      });

      await trackSafeMintExecution(txHash);

      return txHash;
    },
    [writeContractAsync, chainId, trackSafeMintExecution],
  );

  return { ...base, isSafe, mintHaqq };
}

/**
 * Hook to mint HAQQ for a waitlist application via the Ethiq precompile.
 * For Safe users, approve and mint are separate steps controlled by the UI.
 */
export function useMintHaqqByApplication() {
  const {
    writeContractAsync,
    chainId,
    isSafe,
    trackSafeMintExecution,
    ...base
  } = useEthiqMintBase(ETHIQ_MSG_MINT_HAQQ_BY_APPLICATION);

  const mintHaqqByApplication = useCallback(
    async (sender: `0x${string}`, applicationId: bigint) => {
      if (!writeContractAsync) {
        throw new Error('Wallet not connected');
      }
      if (!chainId) {
        throw new Error('Chain ID not available');
      }

      console.log('mintHaqqByApplication', {
        sender,
        applicationId: applicationId.toString(),
      });

      const txHash = await writeContractAsync({
        address: ETHIQ_PRECOMPILE_ADDRESS,
        abi: EthiqAbi,
        functionName: 'mintHaqqByApplication',
        args: [sender, applicationId],
        chainId,
      });

      await trackSafeMintExecution(txHash);

      return txHash;
    },
    [writeContractAsync, chainId, trackSafeMintExecution],
  );

  return { ...base, isSafe, mintHaqqByApplication };
}
