import { Chain as CosmosChain } from '@evmos/transactions';
import { ChainProperties } from '../types';

export function mapToCosmosChain(currentChain: ChainProperties): CosmosChain {
  return {
    chainId: currentChain.id,
    cosmosChainId: currentChain.cosmosChainId,
  };
}
