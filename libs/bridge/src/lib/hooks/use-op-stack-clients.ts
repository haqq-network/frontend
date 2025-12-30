'use client';

import { useCallback, useMemo } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import {
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
  walletActionsL2,
} from 'viem/op-stack';
import { useAccount, useWalletClient } from 'wagmi';
import { getOpStackChains } from '../constants/op-stack-config';

/**
 * Hook to create and manage OP Stack compatible clients for L1 and L2 chains
 * Provides both public and wallet clients with proper OP Stack extensions
 *
 * Note: Wallet clients are extended from wagmi's wallet client to ensure proper
 * signing compatibility with all wallets (MetaMask, Kepler, etc.)
 */
export function useOpStackClients() {
  const { address, chain } = useAccount();
  const { data: wagmiWalletClient } = useWalletClient();

  const opChainL1 = useMemo(() => {
    return getOpStackChains(chain?.id).L1;
  }, [chain?.id]);

  const opChainL2 = useMemo(() => {
    return getOpStackChains(chain?.id).L2;
  }, [chain?.id]);

  // Create L1 public client (Sepolia) with OP Stack contracts
  const publicClientL1 = useMemo(() => {
    return createPublicClient({
      chain: opChainL1,
      transport:
        typeof window !== 'undefined' && window.ethereum
          ? custom(window.ethereum)
          : http(opChainL1.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL1());
  }, [opChainL1]);

  const publicClientReadonlyL1 = useMemo(() => {
    return createPublicClient({
      chain: opChainL1,
      transport: http(opChainL1.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL1());
  }, [opChainL1]);

  // Create L2 public client (HAQQ Devnet) with OP Stack contracts
  const publicClientL2 = useMemo(() => {
    return createPublicClient({
      chain: opChainL2,
      transport:
        typeof window !== 'undefined' && window.ethereum
          ? custom(window.ethereum)
          : http(opChainL2.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL2());
  }, [opChainL2]);

  const publicClientReadonlyL2 = useMemo(() => {
    return createPublicClient({
      chain: opChainL2,
      transport: http(getOpStackChains(chain?.id).L2.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL2());
  }, [opChainL2]);

  // Create L1 wallet client (Sepolia) with OP Stack contracts
  // Extended from wagmi's wallet client to ensure proper signing with all wallets
  const walletClientL1 = useMemo(() => {
    if (!wagmiWalletClient || !address) {
      return null;
    }
    // Extend wagmi's wallet client with OP Stack L1 actions
    // This preserves the proper signing capabilities from the wallet connector
    return wagmiWalletClient.extend(walletActionsL1());
  }, [wagmiWalletClient, address]);

  const getWalletClientL1 = useCallback(async () => {
    return walletClientL1;
  }, [walletClientL1]);

  const walletClientReadonlyL1 = useMemo(() => {
    return wagmiWalletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: opChainL1,
          transport: http(opChainL1.rpcUrls.default.http[0]),
        }).extend(walletActionsL1())
      : null;
  }, [wagmiWalletClient, address, opChainL1]);

  // Create L2 wallet client (HAQQ Devnet) with OP Stack contracts
  // Extended from wagmi's wallet client to ensure proper signing with all wallets
  const walletClientL2 = useMemo(() => {
    if (!wagmiWalletClient || !address) {
      return null;
    }
    // Extend wagmi's wallet client with OP Stack L2 actions
    // This preserves the proper signing capabilities from the wallet connector
    return wagmiWalletClient.extend(walletActionsL2());
  }, [wagmiWalletClient, address]);

  const getWalletClientL2 = useCallback(async () => {
    return walletClientL2;
  }, [walletClientL2]);

  const walletClientReadonlyL2 = useMemo(() => {
    return wagmiWalletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: opChainL2,
          transport: http(opChainL2.rpcUrls.default.http[0]),
        }).extend(walletActionsL2())
      : null;
  }, [wagmiWalletClient, address, opChainL2]);

  const chains = useMemo(() => {
    return getOpStackChains(chain?.id);
  }, [chain?.id]);

  return {
    publicClientL1,
    publicClientL2,
    walletClientL1,
    walletClientL2,
    getWalletClientL1,
    getWalletClientL2,
    publicClientReadonlyL1,
    publicClientReadonlyL2,
    walletClientReadonlyL1,
    walletClientReadonlyL2,
    chains,
  };
}
