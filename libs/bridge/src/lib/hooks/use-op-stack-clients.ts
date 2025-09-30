'use client';

import { useMemo } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import {
  publicActionsL1,
  publicActionsL2,
  walletActionsL1,
  walletActionsL2,
} from 'viem/op-stack';
import { useAccount, useWalletClient } from 'wagmi';
import { OP_STACK_CHAINS } from '../constants/op-stack-config';

/**
 * Hook to create and manage OP Stack compatible clients for L1 and L2 chains
 * Provides both public and wallet clients with proper OP Stack extensions
 */
export function useOpStackClients() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Create L1 public client (Sepolia) with OP Stack contracts
  const publicClientL1 = useMemo(() => {
    return createPublicClient({
      chain: OP_STACK_CHAINS.L1,
      transport: window.ethereum
        ? custom(window.ethereum)
        : http(OP_STACK_CHAINS.L1.rpcUrls.default.http[0]),
    }).extend(publicActionsL1());
  }, []);

  const publicClientReadonlyL1 = useMemo(() => {
    return createPublicClient({
      chain: OP_STACK_CHAINS.L1,
      transport: http(OP_STACK_CHAINS.L1.rpcUrls.default.http[0]),
    }).extend(publicActionsL1());
  }, []);

  // Create L2 public client (HAQQ Devnet) with OP Stack contracts
  const publicClientL2 = useMemo(() => {
    return createPublicClient({
      chain: OP_STACK_CHAINS.L2,
      transport: window.ethereum
        ? custom(window.ethereum)
        : http(OP_STACK_CHAINS.L2.rpcUrls.default.http[0]),
    }).extend(publicActionsL2());
  }, []);

  const publicClientReadonlyL2 = useMemo(() => {
    return createPublicClient({
      chain: OP_STACK_CHAINS.L2,
      transport: http(OP_STACK_CHAINS.L2.rpcUrls.default.http[0]),
    }).extend(publicActionsL2());
  }, []);

  // Create L1 wallet client (Sepolia) with OP Stack contracts
  const walletClientL1 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: OP_STACK_CHAINS.L1,
          transport: window.ethereum
            ? custom(window.ethereum)
            : http(OP_STACK_CHAINS.L1.rpcUrls.default.http[0]),
        }).extend(walletActionsL1())
      : null;
  }, [walletClient, address]);

  const walletClientReadonlyL1 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: OP_STACK_CHAINS.L1,
          transport: http(OP_STACK_CHAINS.L1.rpcUrls.default.http[0]),
        }).extend(walletActionsL1())
      : null;
  }, [walletClient, address]);

  // Create L2 wallet client (HAQQ Devnet) with OP Stack contracts
  const walletClientL2 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: OP_STACK_CHAINS.L2,
          transport: window.ethereum
            ? custom(window.ethereum)
            : http(OP_STACK_CHAINS.L2.rpcUrls.default.http[0]),
        }).extend(walletActionsL2())
      : null;
  }, [walletClient, address]);

  const walletClientReadonlyL2 = useMemo(() => {
    return walletClient && address
      ? createWalletClient({
          account: address as `0x${string}`,
          chain: OP_STACK_CHAINS.L2,
          transport: http(OP_STACK_CHAINS.L2.rpcUrls.default.http[0]),
        }).extend(walletActionsL2())
      : null;
  }, [walletClient, address]);

  return {
    publicClientL1,
    publicClientL2,
    walletClientL1,
    walletClientL2,
    publicClientReadonlyL1,
    publicClientReadonlyL2,
    walletClientReadonlyL1,
    walletClientReadonlyL2,
    chains: OP_STACK_CHAINS,
  };
}
