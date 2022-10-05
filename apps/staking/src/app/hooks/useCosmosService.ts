import { useContext } from 'react';
import { CosmosServiceContext } from '../providers/cosmos-provider';

export function useCosmosService() {
  const cosmosService = useContext(CosmosServiceContext);

  if (!cosmosService) {
    throw new Error(
      'useCosmosService should be used only from child of CosmosServiceContainer',
    );
  }

  return cosmosService;
}
