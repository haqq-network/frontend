'use client';
import { PropsWithChildren, useContext, useMemo, createContext } from 'react';
import { useNetwork } from 'wagmi';
import {
  CosmosService,
  createCosmosService,
  getChainParams,
} from '@haqq/data-access-cosmos';
import { useSupportedChains } from './wagmi-provider';

export type CosmosServiceContextProviderValue =
  | {
      isReady: false;
      service: undefined;
      error: string | undefined;
    }
  | {
      isReady: true;
      service: CosmosService;
      error: string | undefined;
    };

export const CosmosServiceContext =
  createContext<CosmosServiceContextProviderValue>({
    isReady: false,
    service: undefined,
    error: undefined,
  });

export function useCosmosProvider() {
  const cosmosService = useContext(CosmosServiceContext);

  if (!cosmosService) {
    throw new Error(
      'useCosmosProvider should be used only from child of CosmosServiceContext',
    );
  }

  return cosmosService;
}

export function useCosmosService() {
  const cosmosService = useContext(CosmosServiceContext);

  if (!cosmosService.isReady) {
    throw new Error('Cosmos service is not ready');
  }

  return cosmosService.service;
}

export function CosmosServiceContainer({
  children,
  chainId,
}: PropsWithChildren<{
  chainId: number | undefined;
}>) {
  const cosmosService = useMemo<CosmosServiceContextProviderValue>(() => {
    try {
      if (!chainId) {
        return {
          isReady: false,
          service: undefined,
          error: undefined,
        };
      }

      const { cosmosRestEndpoint } = getChainParams(chainId);
      return {
        isReady: true,
        service: createCosmosService(cosmosRestEndpoint),
        error: undefined,
      };
    } catch (error) {
      console.error((error as Error).message);
      return {
        isReady: false,
        service: undefined,
        error: (error as Error).message,
      };
    }
  }, [chainId]);

  return (
    <CosmosServiceContext.Provider value={cosmosService}>
      {children}
    </CosmosServiceContext.Provider>
  );
}

export function CosmosProvider({ children }: PropsWithChildren) {
  const chains = useSupportedChains();
  const { chain } = useNetwork();

  // console.log('CosmosProvider', { chain, chains });

  const chainId =
    chain && chain.unsupported !== undefined && !chain.unsupported
      ? chain.id
      : chains[0].id;

  return (
    <CosmosServiceContainer chainId={chainId}>
      {children}
    </CosmosServiceContainer>
  );
}
