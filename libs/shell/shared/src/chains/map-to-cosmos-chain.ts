import type { Chain as CosmosChain } from '@evmos/transactions';
import type { ChainProperties } from './chains';

export function mapToCosmosChain(currentChain: ChainProperties): CosmosChain {
  return {
    chainId: currentChain.id,
    cosmosChainId: currentChain.cosmosChainId,
  };
}
