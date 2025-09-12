'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useReadContract, usePublicClient } from 'wagmi';
import { getL2TokenAddress } from '@haqq/shell-shared';
import { ERC20FactoryAbi } from '../abi/erc20-factory';

interface Token {
  symbol: string;
  address: string;
  name?: string;
  decimals?: number;
}

interface UseBridgeTokenManagerParams {
  localToken?: Token;
  factoryAddress?: string;
  sourceChainId?: number;
  targetChainId?: number;
}

interface UseBridgeTokenManagerReturn {
  remoteTokenAddress: string | null;
  needsDeployment: boolean;
  isCheckingRemoteToken: boolean;
  getRemoteTokenForBridge: () => Promise<string>;
  refreshRemoteToken: () => Promise<void>;
}

const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * Hook to manage remote token checking and deployment for bridging
 */
export function useBridgeTokenManager({
  localToken,
  factoryAddress,
  sourceChainId,
  targetChainId,
}: UseBridgeTokenManagerParams): UseBridgeTokenManagerReturn {
  const [remoteTokenAddress, setRemoteTokenAddress] = useState<string | null>(
    null,
  );
  const [isCheckingRemoteToken, setIsCheckingRemoteToken] = useState(false);

  const publicClient = usePublicClient({ chainId: targetChainId });

  // Get token name and symbol for deployment
  const { data: tokenName } = useReadContract({
    address: localToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'name',
    chainId: sourceChainId,
    query: {
      enabled: Boolean(
        localToken?.address && localToken.address !== ETH_ADDRESS,
      ),
    },
  });

  const { data: tokenSymbol } = useReadContract({
    address: localToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    chainId: sourceChainId,
    query: {
      enabled: Boolean(
        localToken?.address && localToken.address !== ETH_ADDRESS,
      ),
    },
  });

  // Check if remote token exists
  const checkRemoteToken = useCallback(async (): Promise<string | null> => {
    if (
      !publicClient ||
      !factoryAddress ||
      !localToken?.address ||
      localToken.address === ETH_ADDRESS
    ) {
      return null;
    }

    setIsCheckingRemoteToken(true);

    try {
      // Check for existing deployment using factory events
      const logs = await publicClient.getLogs({
        address: factoryAddress as `0x${string}`,
        event: {
          type: 'event',
          name: 'StandardL2TokenCreated',
          inputs: [
            { name: 'remoteToken', type: 'address', indexed: true },
            { name: 'localToken', type: 'address', indexed: true },
          ],
        },
        args: {
          remoteToken: localToken.address as `0x${string}`,
        },
        fromBlock: 'earliest',
        toBlock: 'latest',
      });

      console.log('logs', logs);

      if (logs.length > 0) {
        // Get the localToken (L2 token) from the most recent deployment
        const latestLog = logs[logs.length - 1];
        const deployedTokenAddress = latestLog.args.localToken;

        console.log(
          'Found existing remote token via events:',
          deployedTokenAddress,
        );

        // Verify the token exists by calling version()
        try {
          await publicClient.readContract({
            address: deployedTokenAddress as `0x${string}`,
            abi: [
              {
                inputs: [],
                name: 'version',
                outputs: [{ name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'version',
          });

          console.log('Verified remote token exists:', deployedTokenAddress);
          return deployedTokenAddress as string;
        } catch (versionError) {
          console.log(
            'Remote token address found in events but version() call failed:',
            versionError,
          );
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking remote token:', error);
      return null;
    } finally {
      setIsCheckingRemoteToken(false);
    }
  }, [publicClient, factoryAddress, localToken?.address]);

  // Check remote token when local token changes
  useEffect(() => {
    if (localToken?.address && localToken.address !== ETH_ADDRESS) {
      checkRemoteToken().then(setRemoteTokenAddress);
    } else {
      setRemoteTokenAddress(null);
    }
  }, [localToken?.address, checkRemoteToken]);

  const needsDeployment = useMemo(() => {
    return Boolean(
      localToken?.address &&
        localToken.address !== ETH_ADDRESS &&
        !remoteTokenAddress &&
        !isCheckingRemoteToken,
    );
  }, [localToken?.address, remoteTokenAddress, isCheckingRemoteToken]);

  // Refresh remote token - useful after deployment on separate page
  const refreshRemoteToken = useCallback(async (): Promise<void> => {
    const address = await checkRemoteToken();
    setRemoteTokenAddress(address);
  }, [checkRemoteToken]);

  const getRemoteTokenForBridge = useCallback(async (): Promise<string> => {
    // For ETH, return the same address
    if (!localToken?.address || localToken.address === ETH_ADDRESS) {
      return localToken?.address || ETH_ADDRESS;
    }

    // If remote token exists, return it
    if (remoteTokenAddress) {
      return remoteTokenAddress;
    }

    // If needs deployment, throw error to indicate deployment is required
    // The calling component should redirect to deployment page
    if (needsDeployment) {
      throw new Error('DEPLOYMENT_REQUIRED');
    }

    // Fallback to local token address (should not happen in normal flow)
    console.warn('Using local token address as fallback for remote token');
    return localToken.address;
  }, [localToken?.address, remoteTokenAddress, needsDeployment]);

  return {
    remoteTokenAddress,
    needsDeployment,
    isCheckingRemoteToken,
    getRemoteTokenForBridge,
    refreshRemoteToken,
  };
}
