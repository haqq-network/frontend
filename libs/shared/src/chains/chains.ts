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
  nativeCurrency: Currency;
  testnet: boolean;
  tmRpcEndpoint: string;
  cosmosRestEndpoint: string;
  ethRpcEndpoint: string;
  blockExplorer?: string;
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
    name: 'HAQQ Devnet',
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
    name: 'HAQQ Testedge 2',
    network: 'haqq-testedge-2',
    cosmosRestEndpoint: 'https://rest.cosmos.testedge2.haqq.network',
    tmRpcEndpoint: 'https://rpc.tm.testedge2.haqq.network',
    ethRpcEndpoint: 'https://rpc.eth.testedge2.haqq.network',
    testnet: true,
    nativeCurrency: currency,
    blockExplorer: 'https://explorer.testedge2.haqq.network/',
  },
  mainnet: {
    id: 11235,
    cosmosChainId: 'haqq_11235-1',
    name: 'HAQQ Mainnet',
    network: 'haqq-mainnet',
    cosmosRestEndpoint: 'https://rest.cosmos.haqq.network',
    tmRpcEndpoint: 'https://rpc.tm.haqq.network',
    ethRpcEndpoint: 'https://rpc.eth.haqq.network',
    testnet: false,
    nativeCurrency: currency,
    blockExplorer: 'https://explorer.haqq.network',
  },
};
