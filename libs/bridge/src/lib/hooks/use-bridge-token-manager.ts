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

  // Remove token deployment hook since deployment is now handled on a separate page

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
      // Method 1: Try to read from a potential deployments mapping
      console.log('factoryAddress', factoryAddress);
      console.log('localToken.address', localToken.address);
      try {
        const result = await publicClient.readContract({
          address: factoryAddress as `0x${string}`,
          abi: ERC20FactoryAbi,
          functionName: 'BRIDGE',
          args: [localToken.address as `0x${string}`],
        });

        if (result && result !== '0x0000000000000000000000000000000000000000') {
          console.log('Found existing remote token:', result);
          return result as string;
        }
      } catch (err) {
        console.log('Deployments mapping not available or token not found');
      }

      // Method 2: Calculate expected token address (if factory is deterministic)
      // This would require implementing the same address calculation logic as the factory

      return getL2TokenAddress(localToken.address);
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
