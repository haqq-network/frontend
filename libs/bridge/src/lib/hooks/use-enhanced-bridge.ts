'use client';

import { useCallback, useState } from 'react';
import { parseEther, parseUnits } from 'viem';
import { useSendTransaction, useWriteContract } from 'wagmi';
import { BRIDGE_ADDRESSES } from '@haqq/shell-shared';
import { useStandardToken } from './use-standard-token';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  decimals?: number;
  formattedBalance?: number;
}

interface UseEnhancedBridgeParams {
  bridgeAddress: string;
  bridgeAbi: any[];
  sourceChainId?: number;
  targetChainId?: number;
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

interface UseEnhancedBridgeReturn {
  bridgeTokens: (
    token: Token,
    amount: number,
    userAddress: string,
    fallbackDecimals?: number,
  ) => Promise<void>;
  isProcessing: boolean;
  isDeployingRemoteToken: boolean;
  needsRemoteTokenDeployment: boolean;
  error: string | null;
  reset: () => void;
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * Enhanced bridge hook that handles remote token deployment automatically
 */
export function useEnhancedBridge({
  bridgeAddress,
  bridgeAbi,
  sourceChainId,
  targetChainId,
  onSuccess,
  onError,
}: UseEnhancedBridgeParams): UseEnhancedBridgeReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState<Token | null>(null);

  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  // Use standard token hook for remote token management
  const {
    remoteTokenAddress,
    needsDeployment,
    isDeploying: isDeployingRemoteToken,
    deployToken,
    error: tokenError,
  } = useStandardToken({
    localToken: currentToken || undefined,
    factoryAddress:
      BRIDGE_ADDRESSES.opChainDeployment
        .optimismMintableERC20FactoryProxyAddress,
    targetChainId,
  });

  const bridgeTokens = useCallback(
    async (
      token: Token,
      amount: number,
      userAddress: string,
      fallbackDecimals = 18,
    ) => {
      if (!sendTransactionAsync || !writeContractAsync) {
        throw new Error('Transaction methods not available');
      }

      setCurrentToken(token);
      setIsProcessing(true);
      setError(null);

      try {
        let hash: string;

        if (token.address === ETH_ADDRESS) {
          // Bridge ETH - no remote token needed
          console.log(`Bridging ${amount} ETH`);
          const amountWei = parseEther(amount.toString());

          hash = await sendTransactionAsync({
            to: bridgeAddress as `0x${string}`,
            value: amountWei,
          });
        } else {
          // Bridge ERC-20 token
          console.log(`Bridging ${amount} ${token.symbol}`);

          let remoteTokenAddr = remoteTokenAddress;

          // If remote token doesn't exist, deploy it first
          if (needsDeployment) {
            console.log('Remote token needs deployment, deploying now...');
            await deployToken();

            // After deployment, we would need to get the actual deployed address
            // For now, use the local token address as fallback
            remoteTokenAddr = token.address;
          }

          const tokenDecimals = token.decimals || fallbackDecimals;
          const amountWei = parseUnits(amount.toString(), tokenDecimals);

          hash = await writeContractAsync({
            address: bridgeAddress as `0x${string}`,
            abi: bridgeAbi,
            functionName: 'bridgeERC20To',
            args: [
              token.address as `0x${string}`, // _localToken
              (remoteTokenAddr || token.address) as `0x${string}`, // _remoteToken
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

        // Include token deployment error if relevant
        const fullError = tokenError
          ? `${errorMessage}. Token error: ${tokenError}`
          : errorMessage;

        setError(fullError);
        onError?.(err as Error);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      bridgeAddress,
      bridgeAbi,
      sendTransactionAsync,
      writeContractAsync,
      remoteTokenAddress,
      needsDeployment,
      deployToken,
      tokenError,
      onSuccess,
      onError,
    ],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsProcessing(false);
    setCurrentToken(null);
  }, []);

  return {
    bridgeTokens,
    isProcessing,
    isDeployingRemoteToken,
    needsRemoteTokenDeployment: needsDeployment,
    error,
    reset,
  };
}
