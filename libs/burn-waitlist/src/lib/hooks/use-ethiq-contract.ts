'use client';

import { useCallback } from 'react';
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import type { Hash } from 'viem';
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk';
import { useConnectorType } from '@haqq/shell-shared';
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
 */
export function useEthiqAllowance(method: string) {
  const { address, chain } = useAccount();
  const { isSafe } = useConnectorType();
  const chainId = chain?.id || WAITLIST_DEFAULT_CHAIN_ID;

  const { data, isLoading, refetch } = useReadContract({
    address: ETHIQ_PRECOMPILE_ADDRESS,
    abi: EthiqAbi,
    functionName: 'allowance',
    args: address ? [address, address, method] : undefined,
    chainId,
    query: {
      enabled: Boolean(address && isSafe),
    },
  });

  const allowance = data as bigint | undefined;

  console.log('useEthiqAllowance', {
    method,
    grantee: address,
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
  const { isSafe } = useConnectorType();
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

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: chainId || WAITLIST_DEFAULT_CHAIN_ID,
  });

  const fetchSafeTransactionStatus = useCallback(
    async (safeTxHash: string) => {
      if (!isSafe) {
        return null;
      }

      try {
        const sdk = new SafeAppsSDK();
        const txDetails = await sdk.txs.getBySafeTxHash(safeTxHash);

        return {
          isExecuted:
            txDetails.txStatus === TransactionStatus.AWAITING_EXECUTION ||
            txDetails.txStatus === TransactionStatus.SUCCESS,
          transactionHash: txDetails.txHash,
        };
      } catch (error) {
        console.error('Error fetching Safe transaction status:', error);
        throw error;
      }
    },
    [isSafe],
  );

  const waitForSafeExecution = useCallback(
    async (
      safeTxHash: string,
      maxAttempts = 20,
      interval = 5000,
    ): Promise<Hash | null> => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const status = await fetchSafeTransactionStatus(safeTxHash);

          if (status && status.isExecuted) {
            return (status.transactionHash as Hash) ?? null;
          }

          await new Promise((resolve) => {
            return setTimeout(resolve, interval);
          });
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error);

          if (attempt === maxAttempts) {
            console.error('Max attempts reached. Transaction tracking failed.');
            return null;
          }
        }
      }

      return null;
    },
    [fetchSafeTransactionStatus],
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

  return {
    writeContractAsync,
    chainId,
    isSafe,
    waitForSafeExecution,
    approve,
    isApproving,
    hash,
    isPending: isApproving || isMintPending,
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
  const { writeContractAsync, chainId, isSafe, waitForSafeExecution, ...base } =
    useEthiqMintBase(ETHIQ_MSG_MINT_HAQQ);

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

      if (isSafe) {
        const executedHash = await waitForSafeExecution(txHash, 30, 1500);
        console.log('mintHaqq Safe tx executed', { executedHash });
      }

      return txHash;
    },
    [writeContractAsync, chainId, isSafe, waitForSafeExecution],
  );

  return { ...base, isSafe, mintHaqq };
}

/**
 * Hook to mint HAQQ for a waitlist application via the Ethiq precompile.
 * For Safe users, approve and mint are separate steps controlled by the UI.
 */
export function useMintHaqqByApplication() {
  const { writeContractAsync, chainId, isSafe, waitForSafeExecution, ...base } =
    useEthiqMintBase(ETHIQ_MSG_MINT_HAQQ_BY_APPLICATION);

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

      if (isSafe) {
        const executedHash = await waitForSafeExecution(txHash, 30, 1500);
        console.log('mintHaqqByApplication Safe tx executed', { executedHash });
      }

      return txHash;
    },
    [writeContractAsync, chainId, isSafe, waitForSafeExecution],
  );

  return { ...base, isSafe, mintHaqqByApplication };
}
