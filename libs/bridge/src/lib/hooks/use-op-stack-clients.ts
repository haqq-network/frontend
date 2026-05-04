'use client';

import { useCallback } from 'react';
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type EIP1193Provider,
} from 'viem';
import {
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
  walletActionsL2,
} from 'viem/op-stack';
import { useAccount, useWalletClient } from 'wagmi';
import { getOpStackChains } from '../constants/op-stack-config';

const LOG_PREFIX = '[OP Stack Clients]';

export interface UseOpStackClientsParams {
  /**
   * When source is an L1 with multiple L2 targets (e.g. sepolia → Testethiq
   * or Devnet 2), pass the selected L2 chain id to disambiguate.
   */
  targetL2ChainId?: number;
}

/**
 * Hook to create OP Stack compatible clients for L1 and L2 chains.
 * Provides getter functions that create clients on demand (no memoization).
 */
export function useOpStackClients(params: UseOpStackClientsParams = {}) {
  const { targetL2ChainId } = params;
  const { address, chain, connector } = useAccount();
  const { data: walletClient } = useWalletClient();

  const getChains = useCallback(() => {
    const chains = getOpStackChains(chain?.id, targetL2ChainId);
    console.log(
      `${LOG_PREFIX} getChains() called (wallet chain: ${chain?.id ?? 'none'}) → L1: ${chains.L1.id}, L2: ${chains.L2.id}`,
    );
    return chains;
  }, [chain?.id, targetL2ChainId]);

  const getPublicClientReadonlyL1 = useCallback(() => {
    const opChainL1 = getOpStackChains(chain?.id, targetL2ChainId).L1;
    console.log(
      `${LOG_PREFIX} getPublicClientReadonlyL1() → creating client for L1 chain ${opChainL1.id} (${opChainL1.name})`,
    );
    return createPublicClient({
      chain: opChainL1,
      transport: http(opChainL1.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL1());
  }, [chain?.id, targetL2ChainId]);

  const getPublicClientReadonlyL2 = useCallback(() => {
    const opChainL2 = getOpStackChains(chain?.id, targetL2ChainId).L2;
    console.log(
      `${LOG_PREFIX} getPublicClientReadonlyL2() → creating client for L2 chain ${opChainL2.id} (${opChainL2.name})`,
    );
    return createPublicClient({
      chain: opChainL2,
      transport: http(opChainL2.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL2());
  }, [chain?.id, targetL2ChainId]);

  const getWalletClientReadonlyL1 = useCallback(() => {
    if (!walletClient || !address) {
      console.log(
        `${LOG_PREFIX} getWalletClientReadonlyL1() → skipped (wallet: ${!!walletClient}, address: ${!!address})`,
      );
      return null;
    }
    const opChainL1 = getOpStackChains(chain?.id, targetL2ChainId).L1;
    console.log(
      `${LOG_PREFIX} getWalletClientReadonlyL1() → creating readonly wallet client for L1 ${opChainL1.id}`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL1,
      transport: http(opChainL1.rpcUrls.default.http[0]),
    }).extend(walletActionsL1());
  }, [walletClient, address, chain?.id, targetL2ChainId]);

  const getWalletClientReadonlyL2 = useCallback(() => {
    if (!walletClient || !address) {
      console.log(
        `${LOG_PREFIX} getWalletClientReadonlyL2() → skipped (wallet: ${!!walletClient}, address: ${!!address})`,
      );
      return null;
    }
    const opChainL2 = getOpStackChains(chain?.id, targetL2ChainId).L2;
    console.log(
      `${LOG_PREFIX} getWalletClientReadonlyL2() → creating readonly wallet client for L2 ${opChainL2.id}`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL2,
      transport: http(opChainL2.rpcUrls.default.http[0]),
    }).extend(walletActionsL2());
  }, [walletClient, address, chain?.id, targetL2ChainId]);

  const getWalletClientL1 = useCallback(async () => {
    if (!address || !connector) {
      console.log(
        `${LOG_PREFIX} getWalletClientL1() → skipped (address: ${!!address}, connector: ${!!connector})`,
      );
      return null;
    }

    // Get provider from the connected connector (works with Safe, MetaMask, etc.)
    const provider = await connector.getProvider();
    if (!provider) {
      console.log(
        `${LOG_PREFIX} getWalletClientL1() → skipped (no provider from connector)`,
      );
      return null;
    }

    const opChainL1 = getOpStackChains(chain?.id, targetL2ChainId).L1;
    console.log(
      `${LOG_PREFIX} getWalletClientL1() → creating wallet client for L1 ${opChainL1.id} (${opChainL1.name}) using ${connector.name} connector`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL1,
      transport: custom(provider as EIP1193Provider),
    }).extend(walletActionsL1());
  }, [address, chain?.id, connector, targetL2ChainId]);

  const getWalletClientL2 = useCallback(async () => {
    if (!address || !connector) {
      console.log(
        `${LOG_PREFIX} getWalletClientL2() → skipped (address: ${!!address}, connector: ${!!connector})`,
      );
      return null;
    }

    // Get provider from the connected connector (works with Safe, MetaMask, etc.)
    const provider = await connector.getProvider();
    if (!provider) {
      console.log(
        `${LOG_PREFIX} getWalletClientL2() → skipped (no provider from connector)`,
      );
      return null;
    }

    const opChainL2 = getOpStackChains(chain?.id, targetL2ChainId).L2;
    console.log(
      `${LOG_PREFIX} getWalletClientL2() → creating wallet client for L2 ${opChainL2.id} (${opChainL2.name}) using ${connector.name} connector`,
    );
    return createWalletClient({
      account: address as `0x${string}`,
      chain: opChainL2,
      transport: custom(provider as EIP1193Provider),
    }).extend(walletActionsL2());
  }, [address, chain?.id, connector, targetL2ChainId]);

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
