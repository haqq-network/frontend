import type { Fee } from '@evmos/transactions';
import { chains } from './chains';

export function getChainParams(chainId: number) {
  const currentChain = chains[chainId];
  // console.log('getChainParams', { chainName, currentChain });

  if (!currentChain) {
    throw new Error(`No configuration for chain with id ${chainId}`);
  }

  return currentChain;
}

export const DEFAULT_FEE: Fee = {
  amount: '2000000000',
  gas: '2000000',
  denom: 'aISLM',
};
