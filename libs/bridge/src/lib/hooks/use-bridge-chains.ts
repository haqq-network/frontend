'use client';

import { useMemo } from 'react';
import { CHAIN_CONFIG, SUPPORTED_CHAINS } from '@haqq/shell-shared';

export interface UseBridgeChainsParams {
  chainId: number | undefined;
}

export interface UseBridgeChainsReturn {
  sourceChainId: number | undefined;
  targetChainId: number;
  isL2ToL1: boolean;
  isChainMismatch: boolean;
  targetChainIdNumber: number | undefined;
}

/**
 * Hook to manage chain-related logic for bridging operations
 * Determines source/target chains, L2->L1 direction, and chain mismatches
 */
export function useBridgeChains({
  chainId,
}: UseBridgeChainsParams): UseBridgeChainsReturn {
  const sourceChainId = chainId;

  // Determine target chain based on source chain
  const targetChainId = useMemo(() => {
    // L1 -> L2 bridging (Sepolia -> HAQQ Testedge2)
    if (sourceChainId === CHAIN_CONFIG.l1ChainId) {
      return CHAIN_CONFIG.l2ChainId;
    }
    // L2 -> L1 bridging
    if (sourceChainId === CHAIN_CONFIG.l2ChainId) {
      return CHAIN_CONFIG.l1ChainId;
    }
    // Default fallback
    return CHAIN_CONFIG.l2ChainId;
  }, [sourceChainId]);

  // Check if this is an L2 to L1 transfer
  const isL2ToL1 = useMemo(() => {
    return (
      sourceChainId === CHAIN_CONFIG.l2ChainId &&
      targetChainId === CHAIN_CONFIG.l1ChainId
    );
  }, [sourceChainId, targetChainId]);

  // Check if current chain is not supported
  const isChainMismatch = useMemo(() => {
    return (
      !chainId ||
      !SUPPORTED_CHAINS.some((supportedChain) => {
        return supportedChain.id === chainId;
      })
    );
  }, [chainId]);

  // Get target chain ID for switching (fallback to first supported chain if mismatch)
  const targetChainIdNumber = useMemo(() => {
    return isChainMismatch ? SUPPORTED_CHAINS[0].id : chainId;
  }, [chainId, isChainMismatch]);

  return {
    sourceChainId,
    targetChainId,
    isL2ToL1,
    isChainMismatch,
    targetChainIdNumber,
  };
}
