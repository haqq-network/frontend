'use client';

import { useCallback, useState } from 'react';
import { formatEther, parseEther, parseGwei, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { useSendTransaction, useWriteContract, usePublicClient } from 'wagmi';
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
  availableBalance: number;
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
  availableBalance,
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
  const publicClient = usePublicClient({ chainId: sourceChainId });

  // Use L2 to L1 withdrawal hook for L2 -> L1 transfers
  const {
    initiateWithdrawal,
    initiateERC20Withdrawal,
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
      // Validate available balance
      if (amount > availableBalance) {
        const error = new Error(
          `Insufficient balance. Available: ${availableBalance}, Requested: ${amount}`,
        );
        setError(error.message);
        onError?.(error);
        throw error;
      }

      // Check if this is an L2 to L1 transfer
      const isL2ToL1 =
        (sourceChainId === CHAIN_CONFIG.l2ChainId &&
          targetChainId === CHAIN_CONFIG.l1ChainId) ||
        (sourceChainId === CHAIN_CONFIG.l2TestChainId &&
          targetChainId === CHAIN_CONFIG.l1TestChainId);

      if (isL2ToL1) {
        if (token.address === ETH_ADDRESS) {
          // Handle L2 to L1 native ETH withdrawal
          console.log(`Initiating L2 to L1 withdrawal of ${amount} ETH`);
          await initiateWithdrawal(amount, userAddress);
          return;
        } else {
          // Handle L2 to L1 ERC20 token withdrawal
          console.log(
            `Initiating L2 to L1 withdrawal of ${amount} ${token.symbol}`,
          );
          const tokenDecimals = token.decimals || fallbackDecimals;
          await initiateERC20Withdrawal(
            token.address,
            amount,
            userAddress,
            tokenDecimals,
            token.symbol,
          );
          return;
        }
      }

      // Handle L1 to L2 transfers or ERC-20 tokens
      if (!sendTransactionAsync || !writeContractAsync) {
        throw new Error('Transaction methods not available');
      }

      setIsProcessing(true);
      setError(null);

      const is100PercentOfAvailableBalance = availableBalance === amount;

      console.log(
        'is100PercentOfAvailableBalance',
        is100PercentOfAvailableBalance,
      );
      try {
        let hash: string;

        if (token.address === ETH_ADDRESS) {
          // Bridge ETH (L1 to L2)
          console.log(`Bridging ${amount} ETH from L1 to L2`);
          let amountWei = parseEther(amount.toString());

          // For 100% of balance, estimate gas and adjust amount
          if (is100PercentOfAvailableBalance && publicClient) {
            try {
              // Estimate gas for the transaction
              const gasEstimate = await publicClient.estimateGas({
                to: bridgeAddress as `0x${string}`,
                value: amountWei,
                account: userAddress as `0x${string}`,
              });
              console.log('gasEstimate', gasEstimate);

              // Get current gas price
              const gasPrice = await publicClient.getGasPrice();

              // Calculate total fee: gas * gasPrice * 1.25 (25% buffer)
              const estimatedFee = (gasEstimate * gasPrice * 125n) / 100n;

              console.log(
                `Estimated fee for 100% balance bridge: ${estimatedFee} ETH`,
              );

              // Adjust amount by subtracting estimated fees

              amountWei = amountWei - estimatedFee;

              if (sourceChainId === sepolia.id) {
                amountWei = amountWei - parseEther('0.0016');
              }

              console.log('amountWei', amountWei);
              console.log(
                `Adjusted bridge amount: ${amountWei} ETH (original: ${amount} ETH)`,
              );
            } catch (estimateError) {
              console.warn(
                'Failed to estimate gas, proceeding with original amount:',
                estimateError,
              );
              // Continue with original amount if estimation fails
            }
          }

          hash = await sendTransactionAsync({
            to: bridgeAddress as `0x${string}`,
            value: amountWei,
          });
        } else {
          // Bridge ERC-20 token
          console.log(`Bridging ${amount} ${token.symbol}`);
          const tokenDecimals = token.decimals || fallbackDecimals;
          const amountWei = parseUnits(amount.toString(), tokenDecimals);

          // Validate balance for ERC-20 tokens
          if (amount > availableBalance) {
            throw new Error(
              `Insufficient ${token.symbol} balance. Available: ${availableBalance}, Requested: ${amount}`,
            );
          }

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
      availableBalance,
      publicClient,
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
