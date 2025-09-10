'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useReadContract, usePublicClient } from 'wagmi';
import { useTokenDeployment } from './use-token-deployment';
import { ERC20FactoryAbi } from '../abi/erc20-factory';
import { getL2TokenAddress } from '@haqq/shell-shared';

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
  deployRemoteToken: () => Promise<string>;
  isDeploying: boolean;
  deploymentError: string | null;
  getRemoteTokenForBridge: () => Promise<string>;
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

  // Token deployment hook
  const {
    deployToken,
    isDeploying,
    deploymentHash,
    error: deploymentError,
    reset: resetDeployment,
  } = useTokenDeployment({
    factoryAddress,
    targetChainId,
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
      // Method 1: Try to read from a potential deployments mapping
      debugger;
      console.log('factoryAddress', factoryAddress);
      console.log('localToken.address', localToken.address);
      try {
        const result = await publicClient.readContract({
          address: factoryAddress as `0x${string}`,
          abi: ERC20FactoryAbi,
          functionName: 'BRIDGE',
          args: [localToken.address as `0x${string}`],
        });

        debugger;

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

  const deployRemoteToken = useCallback(async (): Promise<string> => {
    if (!localToken?.address || !tokenName || !tokenSymbol) {
      throw new Error('Missing token information for deployment');
    }

    console.log(`Deploying remote token: ${tokenName} (${tokenSymbol})`);

    const hash = await deployToken(
      localToken.address,
      tokenName as string,
      tokenSymbol as string,
    );

    await checkRemoteToken();

    // After deployment, we should check for the deployed token address
    // This would typically be done by listening to the deployment event
    // For now, we'll just return the transaction hash
    return hash;
  }, [
    localToken?.address,
    tokenName,
    tokenSymbol,
    deployToken,
    checkRemoteToken,
  ]);

  const getRemoteTokenForBridge = useCallback(async (): Promise<string> => {
    // For ETH, return the same address
    if (!localToken?.address || localToken.address === ETH_ADDRESS) {
      return localToken?.address || ETH_ADDRESS;
    }

    // If remote token exists, return it
    if (remoteTokenAddress) {
      return remoteTokenAddress;
    }

    // If needs deployment, deploy first
    if (needsDeployment) {
      console.log('Remote token needs deployment, deploying now...');
      await deployRemoteToken();

      // After deployment, we would need to get the actual deployed address
      // For now, return the local token address as fallback
      // In a real implementation, you'd parse the deployment event or calculate the address
      return localToken.address;
    }

    // Fallback to local token address
    return localToken.address;
  }, [
    localToken?.address,
    remoteTokenAddress,
    needsDeployment,
    deployRemoteToken,
  ]);

  return {
    remoteTokenAddress,
    needsDeployment,
    isCheckingRemoteToken,
    deployRemoteToken,
    isDeploying,
    deploymentError,
    getRemoteTokenForBridge,
  };
}
