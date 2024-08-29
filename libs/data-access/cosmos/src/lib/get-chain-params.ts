import type { Fee } from '@evmos/transactions';
import { chains } from './chains';

// Add a default chain ID (HAQQ mainnet)
const DEFAULT_CHAIN_ID = 11235;

export function getChainParams(chainId: number) {
  // Check if the chainId is supported, otherwise use the default
  const supportedChainId = chainId in chains ? chainId : DEFAULT_CHAIN_ID;
  return chains[supportedChainId];
}

export const DEFAULT_FEE: Fee = {
  amount: '20000000000000000',
  gas: '700000',
  denom: 'aISLM',
};

export const VESTING_DEFAULT_FEE: Fee = {
  amount: '300000000000000000',
  gas: '15000000',
  denom: 'aISLM',
};
