'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import {
  getRemoteTokenAddress,
  getChainNameFromId,
} from '../services/scanner-api';

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
  sourceChainId,
  targetChainId,
}: UseBridgeTokenManagerParams): UseBridgeTokenManagerReturn {
  const [remoteTokenAddress, setRemoteTokenAddress] = useState<string | null>(
    null,
  );
  const [isCheckingRemoteToken, setIsCheckingRemoteToken] = useState(false);

  const publicClient = usePublicClient({ chainId: targetChainId });

  // Check if remote token exists
  const checkRemoteToken = useCallback(async (): Promise<string | null> => {
    if (
      !publicClient ||
      !localToken?.address ||
      localToken.address === ETH_ADDRESS ||
      !sourceChainId ||
      !targetChainId
    ) {
      return null;
    }

    setIsCheckingRemoteToken(true);

    try {
      // First, try to get remote token from scanner API
      const targetChainName = getChainNameFromId(targetChainId);
      const sourceChainName = getChainNameFromId(sourceChainId);
      console.log(
        `Checking scanner API for token ${localToken.address} from ${sourceChainName} to ${targetChainName}`,
      );

      const scannerRemoteToken = await getRemoteTokenAddress(
        localToken.address,
        sourceChainId,
        targetChainId,
      );

      return scannerRemoteToken;
    } catch (error) {
      console.error('Error checking remote token:', error);
      return null;
    } finally {
      setIsCheckingRemoteToken(false);
    }
  }, [publicClient, localToken?.address, sourceChainId, targetChainId]);

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
