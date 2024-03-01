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
  amount: '20000000000000000',
  gas: '600000',
  denom: 'aISLM',
};

export const VESTING_DEFAULT_FEE: Fee = {
  amount: '300000000000000000',
  gas: '15000000',
  denom: 'aISLM',
};
