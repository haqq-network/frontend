import type { Chain as WagmiChain } from 'wagmi';
import type { Chain as CosmosChain } from '@evmos/transactions';

export interface Currency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainProperties {
  id: number;
  cosmosChainId: string;
  name: string;
  network: string;
  tmRpcEndpoint: string;
  cosmosRestEndpoint: string;
  ethRpcEndpoint: string;
  nativeCurrency: Currency;
  testnet: boolean;
}

const currency: Currency = {
  name: 'Islamic Coin',
  symbol: 'ISLM',
  decimals: 18,
};

export const chains: Record<string, ChainProperties> = {
  dev: {
    id: 121799,
    cosmosChainId: 'haqq_121799-1',
    name: 'Haqq Devnet',
    network: 'haqq-devnet',
    tmRpcEndpoint: 'http://159.69.6.222:26657',
    cosmosRestEndpoint: 'http://159.69.6.222:1317',
    ethRpcEndpoint: 'http://159.69.6.222:8545',
    testnet: true,
    nativeCurrency: currency,
  },
  testedge2: {
    id: 54211,
    cosmosChainId: 'haqq_54211-3',
    name: 'Haqq Testedge 2',
    network: 'haqq-testedge-2',
    cosmosRestEndpoint: 'https://rest.cosmos.testedge2.haqq.network',
    tmRpcEndpoint: 'https://rpc.tm.testedge2.haqq.network',
    ethRpcEndpoint: 'https://rpc.eth.testedge2.haqq.network',
    testnet: true,
    nativeCurrency: currency,
  },
  mainnet: {
    id: 11235,
    cosmosChainId: 'haqq_11235-1',
    name: 'Haqq Mainnet',
    network: 'haqq-mainnet',
    cosmosRestEndpoint: 'https://rest.cosmos.haqq.network',
    tmRpcEndpoint: 'https://rpc.tm.haqq.network',
    ethRpcEndpoint: 'https://rpc.eth.haqq.network',
    testnet: false,
    nativeCurrency: currency,
  },
};

export function getChainParams(chainName: string) {
  const currentChain = chains[chainName];
  console.log({ chainName, currentChain });

  if (!currentChain) {
    throw new Error(`No configuration for ${chainName}`);
  }

  return currentChain;
}

export function mapToWagmiChain(currentChain: ChainProperties): WagmiChain {
  return {
    id: currentChain.id,
    name: currentChain.name,
    network: currentChain.network,
    nativeCurrency: currentChain.nativeCurrency,
    rpcUrls: {
      default: currentChain.ethRpcEndpoint,
    },
    testnet: currentChain.testnet,
  };
}

export function mapToCosmosChain(currentChain: ChainProperties): CosmosChain {
  return {
    chainId: currentChain.id,
    cosmosChainId: currentChain.cosmosChainId,
  };
}
