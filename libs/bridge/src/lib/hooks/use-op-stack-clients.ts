'use client';

import { useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import {
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
  walletActionsL2,
} from 'viem/op-stack';
import { useAccount, useWalletClient } from 'wagmi';
import { getOpStackChains } from '../constants/op-stack-config';

const LOG_PREFIX = '[OP Stack Clients]';

/**
 * Hook to create OP Stack compatible clients for L1 and L2 chains.
 * Provides getter functions that create clients on demand (no memoization).
 */
export function useOpStackClients() {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();

  const getChains = useCallback(() => {
    const chains = getOpStackChains(chain?.id);
    console.log(
      `${LOG_PREFIX} getChains() called (wallet chain: ${chain?.id ?? 'none'}) → L1: ${chains.L1.id}, L2: ${chains.L2.id}`,
    );
    return chains;
  }, [chain?.id]);

  const getPublicClientReadonlyL1 = useCallback(() => {
    const opChainL1 = getOpStackChains(chain?.id).L1;
    console.log(
      `${LOG_PREFIX} getPublicClientReadonlyL1() → creating client for L1 chain ${opChainL1.id} (${opChainL1.name})`,
    );
    return createPublicClient({
      chain: opChainL1,
      transport: http(opChainL1.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL1());
  }, [chain?.id]);

  const getPublicClientReadonlyL2 = useCallback(() => {
    const opChainL2 = getOpStackChains(chain?.id).L2;
    console.log(
      `${LOG_PREFIX} getPublicClientReadonlyL2() → creating client for L2 chain ${opChainL2.id} (${opChainL2.name})`,
    );
    return createPublicClient({
      chain: opChainL2,
      transport: http(opChainL2.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL2());
  }, [chain?.id]);

  const getWalletClientReadonlyL1 = useCallback(() => {
    if (!walletClient || !address) {
      console.log(
        `${LOG_PREFIX} getWalletClientReadonlyL1() → skipped (wallet: ${!!walletClient}, address: ${!!address})`,
      );
      return null;
    }
    const opChainL1 = getOpStackChains(chain?.id).L1;
    console.log(
      `${LOG_PREFIX} getWalletClientReadonlyL1() → creating readonly wallet client for L1 ${opChainL1.id}`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL1,
      transport: http(opChainL1.rpcUrls.default.http[0]),
    }).extend(walletActionsL1());
  }, [walletClient, address, chain?.id]);

  const getWalletClientReadonlyL2 = useCallback(() => {
    if (!walletClient || !address) {
      console.log(
        `${LOG_PREFIX} getWalletClientReadonlyL2() → skipped (wallet: ${!!walletClient}, address: ${!!address})`,
      );
      return null;
    }
    const opChainL2 = getOpStackChains(chain?.id).L2;
    console.log(
      `${LOG_PREFIX} getWalletClientReadonlyL2() → creating readonly wallet client for L2 ${opChainL2.id}`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL2,
      transport: http(opChainL2.rpcUrls.default.http[0]),
    }).extend(walletActionsL2());
  }, [walletClient, address, chain?.id]);

  const getWalletClientL1 = useCallback(async () => {
    if (!address || typeof window === 'undefined' || !window.ethereum) {
      console.log(
        `${LOG_PREFIX} getWalletClientL1() → skipped (address: ${!!address}, ethereum: ${typeof window !== 'undefined' && !!window?.ethereum})`,
      );
      return null;
    }
    const opChainL1 = getOpStackChains(chain?.id).L1;
    console.log(
      `${LOG_PREFIX} getWalletClientL1() → creating wallet client for L1 ${opChainL1.id} (${opChainL1.name})`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL1,
      transport: custom(window.ethereum),
    }).extend(walletActionsL1());
  }, [address, chain?.id]);

  const getWalletClientL2 = useCallback(async () => {
    if (!address || typeof window === 'undefined' || !window.ethereum) {
      console.log(
        `${LOG_PREFIX} getWalletClientL2() → skipped (address: ${!!address}, ethereum: ${typeof window !== 'undefined' && !!window?.ethereum})`,
      );
      return null;
    }
    const opChainL2 = getOpStackChains(chain?.id).L2;
    console.log(
      `${LOG_PREFIX} getWalletClientL2() → creating wallet client for L2 ${opChainL2.id} (${opChainL2.name})`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL2,
      transport: custom(window.ethereum),
    }).extend(walletActionsL2());
  }, [address, chain?.id]);

  return {
    getChains,
    getPublicClientReadonlyL1,
    getPublicClientReadonlyL2,
    getWalletClientReadonlyL1,
    getWalletClientReadonlyL2,
    getWalletClientL1,
    getWalletClientL2,
  };
}
