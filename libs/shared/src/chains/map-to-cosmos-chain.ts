import type { ChainProperties } from './chains';
import type { Chain as CosmosChain } from '@evmos/transactions';

export function mapToCosmosChain(currentChain: ChainProperties): CosmosChain {
  return {
    chainId: currentChain.id,
    cosmosChainId: currentChain.cosmosChainId,
  };
}
