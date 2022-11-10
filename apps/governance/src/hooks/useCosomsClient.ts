import { useContext } from 'react';
import { CosmosClientContext } from '../providers/cosmos-provider';

export function useCosmosClient() {
  const cosmosClient = useContext(CosmosClientContext);

  if (!cosmosClient) {
    throw new Error(
      'useCosmosClient should be used only from child of CosmosClientContext',
    );
  }

  return cosmosClient;
}
