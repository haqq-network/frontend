'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface Token {
  symbol: string;
  address: string;
  name?: string;
  balance?: string;
  decimals?: number;
  formattedBalance?: number;
}

export interface UseBridgeHandlersParams {
  // Approval params
  selectedToken: Token | null;
  bridgeAmount: number | undefined;
  balance: any;
  approve: (amount: number, decimals: number) => Promise<void>;

  // Bridge params
  canBridge: boolean;
  address: string | undefined;
  needsDeployment: boolean;
  sourceChainId: number | undefined;
  targetChainId: number;
  getRemoteTokenForBridge: () => Promise<string> | Promise<`0x${string}`>;
  bridgeTokens: (
    token: Token,
    amount: number,
    userAddress: string,
    remoteToken: `0x${string}`,
    decimals: number,
  ) => Promise<void>;
  buildDeploymentUrl: (
    tokenAddress: string,
    sourceChain: number,
    targetChain: number,
  ) => string;

  // Chain switch params
  switchChainAsync: ((params: { chainId: number }) => Promise<any>) | undefined;
  targetChainIdNumber: number | undefined;
}

export interface UseBridgeHandlersReturn {
  handleApprove: () => Promise<void>;
  handleTokenDeployment: () => void;
  handleBridge: () => Promise<void>;
  handleSwitchChain: () => Promise<void>;
}

/**
 * Hook to manage all bridge-related action handlers
 * Consolidates approval, deployment, bridging, and chain switching logic
 */
export function useBridgeHandlers({
  selectedToken,
  bridgeAmount,
  balance,
  approve,
  canBridge,
  address,
  needsDeployment,
  sourceChainId,
  targetChainId,
  getRemoteTokenForBridge,
  bridgeTokens,
  buildDeploymentUrl,
  switchChainAsync,
  targetChainIdNumber,
}: UseBridgeHandlersParams): UseBridgeHandlersReturn {
  const router = useRouter();

  // Handle token approval
  const handleApprove = useCallback(async () => {
    if (!selectedToken || !bridgeAmount) return;

    const tokenDecimals = selectedToken.decimals || balance?.decimals || 18;
    await approve(bridgeAmount, tokenDecimals);
  }, [selectedToken, bridgeAmount, balance, approve]);

  // Handle token deployment (redirect to deployment page)
  const handleTokenDeployment = useCallback(() => {
    if (!needsDeployment || !selectedToken || !sourceChainId || !targetChainId)
      return;

    const deploymentUrl = buildDeploymentUrl(
      selectedToken.address,
      sourceChainId,
      targetChainId,
    );
    router.push(deploymentUrl);
  }, [
    needsDeployment,
    selectedToken,
    sourceChainId,
    targetChainId,
    buildDeploymentUrl,
    router,
  ]);

  // Handle bridge operation
  const handleBridge = useCallback(async () => {
    if (!canBridge || !address || !bridgeAmount || !selectedToken) return;

    // Check if token needs deployment first
    if (needsDeployment) {
      if (!sourceChainId) {
        console.error('Source chain ID is required for deployment');
        return;
      }
      const deploymentUrl = buildDeploymentUrl(
        selectedToken.address,
        sourceChainId,
        targetChainId,
      );
      router.push(deploymentUrl);
      return;
    }

    // Proceed with bridge if remote token exists
    try {
      const remoteTokenAddr = await getRemoteTokenForBridge();
      console.log('Remote token address for bridging:', remoteTokenAddr);

      const fallbackDecimals = balance?.decimals || 18;
      await bridgeTokens(
        selectedToken,
        bridgeAmount,
        address,
        remoteTokenAddr as `0x${string}`,
        fallbackDecimals,
      );
    } catch (error) {
      console.error('Bridge operation failed:', error);
    }
  }, [
    canBridge,
    address,
    bridgeAmount,
    selectedToken,
    balance,
    bridgeTokens,
    getRemoteTokenForBridge,
    needsDeployment,
    buildDeploymentUrl,
    sourceChainId,
    targetChainId,
    router,
  ]);

  // Handle chain switching
  const handleSwitchChain = useCallback(async () => {
    if (!switchChainAsync || !targetChainIdNumber) return;

    try {
      await switchChainAsync({ chainId: targetChainIdNumber });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  }, [switchChainAsync, targetChainIdNumber]);

  return {
    handleApprove,
    handleTokenDeployment,
    handleBridge,
    handleSwitchChain,
  };
}
