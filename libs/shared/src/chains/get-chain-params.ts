import { chains } from './chains';

export function getChainParams(chainName: string) {
  const currentChain = chains[chainName];
  // console.log('getChainParams', { chainName, currentChain });

  if (!currentChain) {
    throw new Error(`No configuration for ${chainName}`);
  }

  return currentChain;
}
