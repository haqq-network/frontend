'use client';

import { useCallback, useState } from 'react';
import { useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits } from 'viem';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  decimals?: number;
  formattedBalance?: number;
}

interface UseBridgeTransactionParams {
  bridgeAddress: string;
  bridgeAbi: any[];
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

interface UseBridgeTransactionReturn {
  bridgeTokens: (
    token: Token,
    amount: number,
    userAddress: string,
    fallbackDecimals?: number
  ) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  reset: () => void;
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * Hook to handle bridge transactions for both ETH and ERC-20 tokens
 */
export function useBridgeTransaction({
  bridgeAddress,
  bridgeAbi,
  onSuccess,
  onError,
}: UseBridgeTransactionParams): UseBridgeTransactionReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const bridgeTokens = useCallback(
    async (
      token: Token,
      amount: number,
      userAddress: string,
      fallbackDecimals = 18
    ) => {
      if (!sendTransactionAsync || !writeContractAsync) {
        throw new Error('Transaction methods not available');
      }

      setIsProcessing(true);
      setError(null);

      try {
        let hash: string;

        if (token.address === ETH_ADDRESS) {
          // Bridge ETH
          console.log(`Bridging ${amount} ETH`);
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

          hash = await writeContractAsync({
            address: bridgeAddress as `0x${string}`,
            abi: bridgeAbi,
            functionName: 'bridgeERC20To',
            args: [
              token.address as `0x${string}`, // _localToken
              token.address as `0x${string}`, // _remoteToken (same for now)
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
        const errorMessage = err instanceof Error ? err.message : 'Bridge transaction failed';
        console.error('Bridge transaction failed:', err);
        setError(errorMessage);
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [bridgeAddress, bridgeAbi, sendTransactionAsync, writeContractAsync, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    bridgeTokens,
    isProcessing,
    error,
    reset,
  };
}
