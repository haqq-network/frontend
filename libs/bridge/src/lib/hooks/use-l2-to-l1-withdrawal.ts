'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseEther,
} from 'viem';
import { sepolia } from 'viem/chains';
import {
  getWithdrawals,
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
  walletActionsL2,
} from 'viem/op-stack';
import { useAccount, useWalletClient } from 'wagmi';
import { haqqDevnet1, BRIDGE_ADDRESSES, useToast } from '@haqq/shell-shared';
import { useWithdrawalOrders } from './use-withdrawal-orders';
import { WithdrawalStatus } from '../types/withdrawal-order';

// Create OP Stack compatible chain configurations
const haqqDevnet1WithContracts = {
  ...haqqDevnet1,
  contracts: {
    portal: {
      [sepolia.id]: {
        address: BRIDGE_ADDRESSES.opChainDeployment
          .optimismPortalProxyAddress as `0x${string}`,
      },
    },
    l2OutputOracle: {
      [sepolia.id]: {
        // deprecated https://docs.optimism.io/stack/smart-contracts/smart-contracts
        address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Placeholder
      },
    },
  },
};

interface UseL2ToL1WithdrawalParams {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  onProveSuccess?: (hash: string) => void;
  onFinalizeSuccess?: (hash: string) => void;
  tokenSymbol?: string;
}

interface UseL2ToL1WithdrawalReturn {
  initiateWithdrawal: (amount: number, toAddress: string) => Promise<string>;
  proveWithdrawal: (withdrawalHash: string) => Promise<string>;
  finalizeWithdrawal: (withdrawalHash: string) => Promise<string>;
  isProcessing: boolean;
  isProving: boolean;
  isFinalizing: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook to handle L2 to L1 native ETH withdrawals with prove and finalize states
 */
export function useL2ToL1Withdrawal({
  onSuccess,
  onError,
  onProveSuccess,
  onFinalizeSuccess,
  tokenSymbol = 'ETH',
}: UseL2ToL1WithdrawalParams): UseL2ToL1WithdrawalReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProving, setIsProving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { addWithdrawalOrder, updateOrderByInitiateHash } =
    useWithdrawalOrders();

  // Create L1 client (Sepolia) with OP Stack contracts
  const publicClientSepolia = useMemo(() => {
    return createPublicClient({
      chain: sepolia,
      // transport: http(sepolia.rpcUrls.default.http[0]),
      transport: window.ethereum
        ? custom(window.ethereum)
        : http(sepolia.rpcUrls.default.http[0]),
    }).extend(publicActionsL1());
  }, []);

  // Create L2 client (HAQQ Devnet) with OP Stack contracts
  const publicClientHaqqDevnet = useMemo(() => {
    return createPublicClient({
      chain: haqqDevnet1,
      transport: window.ethereum
        ? custom(window.ethereum)
        : http(haqqDevnet1.rpcUrls.default.http[0]),
    }).extend(publicActionsL2());
  }, []);

  // Create wallet clients for both chains
  const walletClientSepolia = useMemo(() => {
    return walletClient
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: sepolia,
          transport: window.ethereum
            ? custom(window.ethereum)
            : http(sepolia.rpcUrls.default.http[0]),
        }).extend(walletActionsL1())
      : null;
  }, [walletClient, address]);

  const walletClientHaqqDevnet = useMemo(() => {
    return walletClient
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: haqqDevnet1,
          transport: window.ethereum
            ? custom(window.ethereum)
            : http(haqqDevnet1.rpcUrls.default.http[0]),
        }).extend(walletActionsL2())
      : null;
  }, [walletClient, address]);

  const toast = useToast();

  const initiateWithdrawal = useCallback(
    async (amount: number, toAddress: string): Promise<string> => {
      if (!address || !walletClientHaqqDevnet) {
        throw new Error('Wallet not connected or wallet client not available');
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Step 1: Build parameters to initiate the withdrawal transaction on the L1
        // According to Viem docs: "Build parameters to initiate the withdrawal transaction on the L1"
        const args = await publicClientSepolia.buildInitiateWithdrawal({
          account: address as `0x${string}`,
          to: toAddress as `0x${string}`,
          value: parseEther(amount.toString()),
          gas: 21_000n, // Gas limit for transaction execution on the L1
        });

        // Step 2: Execute the initiate withdrawal transaction on the L2
        // According to Viem docs: "Execute the initiate withdrawal transaction on the L2"
        const hash = await walletClientHaqqDevnet.initiateWithdrawal({
          ...args,
        });

        // Step 3: Wait for the initiate withdrawal transaction receipt
        // According to Viem docs: "Wait for the initiate withdrawal transaction receipt"
        const receipt = await publicClientHaqqDevnet.waitForTransactionReceipt({
          hash,
        });

        console.log(`Withdrawal initiated successfully: ${hash}`);

        // Save withdrawal order to local storage
        addWithdrawalOrder({
          amount,
          toAddress,
          fromAddress: address,
          initiateHash: hash,
          status: WithdrawalStatus.INITIATED,
          sourceChainId: haqqDevnet1.id,
          targetChainId: sepolia.id,
          tokenSymbol,
        });

        onSuccess?.(receipt.transactionHash);
        return hash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Withdrawal initiation failed';
        console.error('Withdrawal initiation failed:', err);
        setError(errorMessage);
        toast.error('Withdrawal initiation failed');
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      address,
      walletClientHaqqDevnet,
      publicClientSepolia,
      publicClientHaqqDevnet,
      addWithdrawalOrder,
      onSuccess,
      onError,
    ],
  );

  const proveWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      if (!walletClientSepolia) {
        throw new Error('Wallet client not available for proving');
      }

      setIsProving(true);
      setError(null);

      try {
        // Step 1: Get withdrawal receipt from L2
        const receipt = await publicClientHaqqDevnet.getTransactionReceipt({
          hash: withdrawalHash as `0x${string}`,
        });

        // Step 2: Wait until the withdrawal is ready to prove
        // According to Viem docs: "Wait until the withdrawal is ready to prove"
        const { output, withdrawal } = await publicClientSepolia.waitToProve({
          receipt,
          targetChain: haqqDevnet1WithContracts,
        });

        // Step 3: Build parameters to prove the withdrawal on the L2
        // According to Viem docs: "Build parameters to prove the withdrawal on the L2"
        const proveArgs = await publicClientHaqqDevnet.buildProveWithdrawal({
          output,
          withdrawal,
        });

        // Step 4: Prove the withdrawal on the L1
        // According to Viem docs: "Prove the withdrawal on the L1"
        const proveHash = await walletClientSepolia.proveWithdrawal({
          ...proveArgs,
          targetChain: haqqDevnet1WithContracts,
        });

        // Step 5: Wait until the prove withdrawal is processed
        // According to Viem docs: "Wait until the prove withdrawal is processed"
        const proveReceipt =
          await publicClientSepolia.waitForTransactionReceipt({
            hash: proveHash,
          });

        console.log(`Withdrawal proved successfully: ${proveHash}`);

        // Update withdrawal order status
        updateOrderByInitiateHash(withdrawalHash, {
          status: WithdrawalStatus.PROVED,
          proveHash: proveHash,
        });

        onProveSuccess?.(proveReceipt.transactionHash);
        return proveHash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Prove withdrawal failed';
        console.error('Prove withdrawal failed:', err);

        setError(errorMessage);
        toast.error('Prove withdrawal failed');
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProving(false);
      }
    },
    [
      walletClientSepolia,
      walletClientHaqqDevnet,
      publicClientSepolia,
      publicClientHaqqDevnet,
      updateOrderByInitiateHash,
      onProveSuccess,
      onError,
    ],
  );

  const finalizeWithdrawal = useCallback(
    async (withdrawalHash: string): Promise<string> => {
      if (!walletClientSepolia) {
        throw new Error('Wallet client not available for finalizing');
      }

      setIsFinalizing(true);
      setError(null);

      try {
        // Step 1: Get withdrawal receipt from L2
        const receipt = await publicClientHaqqDevnet.getTransactionReceipt({
          hash: withdrawalHash as `0x${string}`,
        });

        // Step 2: Get withdrawal data from receipt
        // According to Viem docs: "Get withdrawals from receipt"
        const [withdrawal] = getWithdrawals(receipt);

        // Step 3: Wait until the withdrawal is ready to finalize
        // According to Viem docs: "Wait until the withdrawal is ready to finalize"
        await publicClientSepolia.waitToFinalize({
          targetChain: haqqDevnet1WithContracts,
          withdrawalHash: withdrawal.withdrawalHash,
        });

        // Step 4: Finalize the withdrawal
        // According to Viem docs: "Finalize the withdrawal"
        const finalizeHash = await walletClientSepolia.finalizeWithdrawal({
          targetChain: haqqDevnet1WithContracts,
          withdrawal,
        });

        // Step 5: Wait until the withdrawal is finalized
        // According to Viem docs: "Wait until the withdrawal is finalized"
        const finalizeReceipt =
          await publicClientSepolia.waitForTransactionReceipt({
            hash: finalizeHash,
          });

        console.log(`Withdrawal finalized successfully: ${finalizeHash}`);

        // Update withdrawal order status
        updateOrderByInitiateHash(withdrawalHash, {
          status: WithdrawalStatus.FINALIZED,
          finalizeHash: finalizeHash,
        });

        onFinalizeSuccess?.(finalizeReceipt.transactionHash);
        return finalizeHash;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Finalize withdrawal failed';
        console.error('Finalize withdrawal failed:', err);

        setError(errorMessage);
        toast.error('Finalize withdrawal failed');
        onError?.(err as Error);
        throw err;
      } finally {
        setIsFinalizing(false);
      }
    },
    [
      walletClientSepolia,
      walletClientHaqqDevnet,
      publicClientSepolia,
      publicClientHaqqDevnet,
      updateOrderByInitiateHash,
      onFinalizeSuccess,
      onError,
    ],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsProcessing(false);
    setIsProving(false);
    setIsFinalizing(false);
  }, []);

  return {
    initiateWithdrawal,
    proveWithdrawal,
    finalizeWithdrawal,
    isProcessing,
    isProving,
    isFinalizing,
    error,
    reset,
  };
}
