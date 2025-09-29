'use client';

import { useCallback, useState } from 'react';
import { parseEther, parseUnits } from 'viem';
import { useSendTransaction, useWriteContract } from 'wagmi';
import { L1StandardBridgeAbi, CHAIN_CONFIG } from '@haqq/shell-shared';
import { useL2ToL1Withdrawal } from './use-l2-to-l1-withdrawal';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  decimals?: number;
  formattedBalance?: number;
}

interface UseBridgeTransactionParams {
  bridgeAddress: string;
  sourceChainId?: number;
  targetChainId?: number;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  onProveSuccess?: (hash: string) => void;
  onFinalizeSuccess?: (hash: string) => void;
}

interface UseBridgeTransactionReturn {
  bridgeTokens: (
    token: Token,
    amount: number,
    userAddress: string,
    remoteTokenAddress: string,
    fallbackDecimals?: number,
  ) => Promise<void>;
  isProcessing: boolean;
  isProving: boolean;
  isFinalizing: boolean;
  error: string | null;
  reset: () => void;
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * Hook to handle bridge transactions for both ETH and ERC-20 tokens
 */
export function useBridgeTransaction({
  bridgeAddress,
  sourceChainId,
  targetChainId,
  onSuccess,
  onError,
  onProveSuccess,
  onFinalizeSuccess,
}: UseBridgeTransactionParams): UseBridgeTransactionReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  // Use L2 to L1 withdrawal hook for L2 -> L1 transfers
  const {
    initiateWithdrawal,
    proveWithdrawal,
    finalizeWithdrawal,
    isProcessing: isL2Processing,
    isProving,
    isFinalizing,
    error: l2Error,
  } = useL2ToL1Withdrawal({
    onSuccess,
    onError,
    onProveSuccess,
    onFinalizeSuccess,
  });

  const bridgeTokens = useCallback(
    async (
      token: Token,
      amount: number,
      userAddress: string,
      remoteTokenAddress: string,
      fallbackDecimals = 18,
    ) => {
      // Check if this is an L2 to L1 transfer
      const isL2ToL1 =
        sourceChainId === CHAIN_CONFIG.l2ChainId &&
        targetChainId === CHAIN_CONFIG.l1ChainId;

      if (isL2ToL1 && token.address === ETH_ADDRESS) {
        // Handle L2 to L1 native ETH withdrawal
        console.log(`Initiating L2 to L1 withdrawal of ${amount} ETH`);
        const hash = await initiateWithdrawal(amount, userAddress);

        await proveWithdrawal(hash);
        await finalizeWithdrawal(hash);

        return;
      }

      // Handle L1 to L2 transfers or ERC-20 tokens
      if (!sendTransactionAsync || !writeContractAsync) {
        throw new Error('Transaction methods not available');
      }

      setIsProcessing(true);
      setError(null);

      try {
        let hash: string;

        if (token.address === ETH_ADDRESS) {
          // Bridge ETH (L1 to L2)
          console.log(`Bridging ${amount} ETH from L1 to L2`);
          const amountWei = parseEther(amount.toString());

          hash = await sendTransactionAsync({
            to: bridgeAddress as `0x${string}`,
            value: amountWei,
          });
        } else {
          // Bridge ERC-20 token
          console.log(`Bridging ${amount} ${token.symbol}`);
          const tokenDecimals = token.decimals || fallbackDecimals;
          const amountWei = parseUnits(amount.toString(), tokenDecimals);

          // For now, use the same address for both local and remote token
          hash = await writeContractAsync({
            address: bridgeAddress as `0x${string}`,
            abi: L1StandardBridgeAbi,
            functionName: 'bridgeERC20To',
            args: [
              token.address as `0x${string}`, // _localToken
              remoteTokenAddress as `0x${string}`, // _remoteToken
              userAddress as `0x${string}`, // _to
              amountWei, // _amount
              200000, // _minGasLimit
              '0x' as `0x${string}`, // _extraData
            ],
          });
        }

        console.log('Bridge transaction hash:', hash);
        onSuccess?.(hash);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Bridge transaction failed';
        console.error('Bridge transaction failed:', err);
        setError(errorMessage);
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      sourceChainId,
      targetChainId,
      bridgeAddress,
      sendTransactionAsync,
      writeContractAsync,
      onSuccess,
      onError,
      initiateWithdrawal,
    ],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    bridgeTokens,
    isProcessing: isProcessing || isL2Processing,
    isProving,
    isFinalizing,
    error: error || l2Error,
    reset,
  };
}
