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
 */
export function useOpStackClients() {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Create L1 public client (Sepolia) with OP Stack contracts
  const publicClientL1 = useMemo(() => {
    return createPublicClient({
      chain: getOpStackChains(chain?.id).L1,
      transport:
        typeof window !== 'undefined' && window.ethereum
          ? custom(window.ethereum)
          : http(getOpStackChains(chain?.id).L1.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL1());
  }, [chain?.id]);

  const publicClientReadonlyL1 = useMemo(() => {
    return createPublicClient({
      chain: getOpStackChains(chain?.id).L1,
      transport: http(getOpStackChains(chain?.id).L1.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL1());
  }, [chain?.id]);

  // Create L2 public client (HAQQ Devnet) with OP Stack contracts
  const publicClientL2 = useMemo(() => {
    return createPublicClient({
      chain: getOpStackChains(chain?.id).L2,
      transport:
        typeof window !== 'undefined' && window.ethereum
          ? custom(window.ethereum)
          : http(getOpStackChains(chain?.id).L2.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL2());
  }, [chain?.id]);

  const publicClientReadonlyL2 = useMemo(() => {
    return createPublicClient({
      chain: getOpStackChains(chain?.id).L2,
      transport: http(getOpStackChains(chain?.id).L2.rpcUrls.default.http[0]),
      batch: { multicall: true },
    }).extend(publicActionsL2());
  }, [chain?.id]);

  // Create L1 wallet client (Sepolia) with OP Stack contracts
  const walletClientL1 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: getOpStackChains(chain?.id).L1,
          transport:
            typeof window !== 'undefined' && window.ethereum
              ? custom(window.ethereum)
              : http(getOpStackChains(chain?.id).L1.rpcUrls.default.http[0]),
        }).extend(walletActionsL1())
      : null;
  }, [walletClient, address, chain?.id]);

  const getWalletClientL1 = useCallback(async () => {
    if (walletClientL1) {
      return walletClientL1;
    }

    if (address && typeof window !== 'undefined' && window.ethereum) {
      return createWalletClient({
        account: address as `0x${string}`,
        chain: getOpStackChains(chain?.id).L1,
        transport: custom(window.ethereum),
      }).extend(walletActionsL1());
    }

    return null;
  }, [address, walletClientL1]);

  const walletClientReadonlyL1 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: getOpStackChains(chain?.id).L1,
          transport: http(
            getOpStackChains(chain?.id).L1.rpcUrls.default.http[0],
          ),
        }).extend(walletActionsL1())
      : null;
  }, [walletClient, address, chain?.id]);

  // Create L2 wallet client (HAQQ Devnet) with OP Stack contracts
  const walletClientL2 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: getOpStackChains(chain?.id).L2,
          transport:
            typeof window !== 'undefined' && window.ethereum
              ? custom(window.ethereum)
              : http(getOpStackChains(chain?.id).L2.rpcUrls.default.http[0]),
        }).extend(walletActionsL2())
      : null;
  }, [walletClient, address, chain?.id]);

  const getWalletClientL2 = useCallback(async () => {
    if (walletClientL2) {
      return walletClientL2;
    }

    if (address && typeof window !== 'undefined' && window.ethereum) {
      return createWalletClient({
        account: address as `0x${string}`,
        chain: getOpStackChains(chain?.id).L2,
        transport: custom(window.ethereum),
      }).extend(walletActionsL2());
    }

    return null;
  }, [address, walletClientL2, chain?.id]);

  const walletClientReadonlyL2 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: getOpStackChains(chain?.id).L2,
          transport: http(
            getOpStackChains(chain?.id).L2.rpcUrls.default.http[0],
          ),
        }).extend(walletActionsL2())
      : null;
  }, [walletClient, address, chain?.id]);

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
    chains: getOpStackChains(chain?.id),
  };
}
