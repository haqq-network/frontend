'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  useWriteContract,
  useReadContract,
  useAccount,
  useConfig,
  type Config,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import {
  useConnectorType,
  approveAbi,
  allowanceAbi,
  MAX_UINT256_MINUS_ONE,
} from '@haqq/shell-shared';

interface SafeApproveConfig {
  /** Precompile contract address. */
  precompileAddress: `0x${string}`;
  /** Cosmos message types to approve. */
  methods: string[];
}

/**
 * Hook to manage Safe wallet approve flow.
 * Works with any precompile that has approve(address,uint256,string[]) / allowance(address,address,string).
 *
 * - Max approve (MAX_UINT256_MINUS_ONE)
 * - Checks allowance against form amount
 */
export function useWaitlistSafeApprove(
  formAmount: bigint | undefined,
  { precompileAddress, methods }: SafeApproveConfig,
) {
  const { address } = useAccount();
  const { isSafe } = useConnectorType();
  const wagmiConfig = useConfig();
  const { writeContractAsync } = useWriteContract();
  const [isApproving, setIsApproving] = useState(false);

  console.log('[useWaitlistSafeApprove] init', {
    address,
    isSafe,
    precompileAddress,
    methods,
    formAmount: formAmount?.toString(),
  });

  // Check allowance for the primary method
  const { data: allowance, refetch: refetchAllowance } = useReadContract<
    typeof allowanceAbi,
    'allowance',
    [string, string, string],
    Config,
    bigint
  >({
    address: precompileAddress,
    abi: allowanceAbi,
    functionName: 'allowance',
    args: address ? [address, address, methods[0]] : undefined,
    query: {
      enabled: Boolean(address && isSafe),
    },
  });

  console.log('[useWaitlistSafeApprove] allowance result', {
    allowance: allowance?.toString(),
    allowanceRaw: allowance,
  });

  // Determine if approval is needed: isSafe + allowance < formAmount
  const needsApproval = useMemo(() => {
    if (!isSafe) {
      console.log('[useWaitlistSafeApprove] needsApproval: false (not Safe)');
      return false;
    }
    if (!formAmount || formAmount <= 0n) {
      console.log(
        '[useWaitlistSafeApprove] needsApproval: false (no formAmount)',
      );
      return false;
    }
    if (allowance === undefined) {
      // Still loading — assume approval needed
      console.log(
        '[useWaitlistSafeApprove] needsApproval: true (allowance loading)',
      );
      return true;
    }
    const needs = allowance < formAmount;
    console.log('[useWaitlistSafeApprove] needsApproval:', needs, {
      allowance: allowance.toString(),
      formAmount: formAmount.toString(),
    });
    return needs;
  }, [isSafe, formAmount, allowance]);

  // Max approve on the precompile
  const handleApprove = useCallback(async () => {
    if (!address || !writeContractAsync) {
      throw new Error('No address or write contract available');
    }

    setIsApproving(true);
    console.log('[useWaitlistSafeApprove] handleApprove called', {
      address,
      precompileAddress,
      methods,
      maxAmount: MAX_UINT256_MINUS_ONE.toString(),
    });
    try {
      const txHash = await writeContractAsync({
        address: precompileAddress,
        abi: approveAbi,
        functionName: 'approve',
        args: [address, MAX_UINT256_MINUS_ONE, methods],
      });

      console.log('[useWaitlistSafeApprove] approve tx hash:', txHash);

      if (!txHash) {
        throw new Error('Approve transaction failed');
      }

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      });

      console.log('[useWaitlistSafeApprove] approve receipt:', {
        status: receipt.status,
        hash: receipt.transactionHash,
      });

      if (receipt.status !== 'success') {
        throw new Error('Approve transaction failed');
      }

      await refetchAllowance();
      console.log('[useWaitlistSafeApprove] allowance refetched after approve');
      return receipt;
    } catch (error) {
      console.error('[useWaitlistSafeApprove] approve error:', error);
      throw error;
    } finally {
      setIsApproving(false);
    }
  }, [
    address,
    writeContractAsync,
    precompileAddress,
    methods,
    wagmiConfig,
    refetchAllowance,
  ]);

  return {
    isSafe,
    allowance,
    needsApproval,
    isApproving,
    handleApprove,
    refetchAllowance,
  };
}
