import { createPublicClient, http } from 'viem';
import { publicActionsL1, publicActionsL2 } from 'viem/op-stack';
import { getOpStackChains } from '../constants/op-stack-config';
import type { WithdrawalOrder } from '../types/withdrawal-order';

// Sepolia bridges to multiple L2s (testethiq + devnet2). The connected wallet's
// chain alone can't disambiguate, so we derive the L1/L2 pair from the order's
// own sourceChainId — otherwise a card defaults to the same L2 client and any
// receipt fetch / prove arg build silently hits the wrong L2 RPC.
export const getChainsForOrder = (
  order: Pick<WithdrawalOrder, 'sourceChainId'>,
) => {
  return getOpStackChains(order.sourceChainId);
};

export const buildPublicClientsForOrder = (
  order: Pick<WithdrawalOrder, 'sourceChainId'>,
) => {
  const chains = getChainsForOrder(order);
  const publicClientL1 = createPublicClient({
    chain: chains.L1,
    transport: http(chains.L1.rpcUrls.default.http[0]),
    batch: { multicall: true },
  }).extend(publicActionsL1());
  const publicClientL2 = createPublicClient({
    chain: chains.L2,
    transport: http(chains.L2.rpcUrls.default.http[0]),
    batch: { multicall: true },
  }).extend(publicActionsL2());
  return { chains, publicClientL1, publicClientL2 };
};
