export interface ChainProperties {
  id: number;
  cosmosChainId: string;
  name: string;
  network: string;
  tmRpcEndpoint: string;
  cosmosRestEndpoint: string;
}

export const chains: Record<number, ChainProperties> = {
  121799: {
    id: 121799,
    cosmosChainId: 'haqq_121799-1',
    name: 'HAQQ Localnet',
    network: 'haqq-localnet',
    tmRpcEndpoint: 'http://127.0.0.1:26657',
    cosmosRestEndpoint: 'http://127.0.0.1:1317',
  },
  54211: {
    id: 54211,
    cosmosChainId: 'haqq_54211-3',
    name: 'HAQQ Testedge 2',
    network: 'haqq-testedge-2',
    tmRpcEndpoint: 'https://rpc.tm.testedge2.haqq.network',
    cosmosRestEndpoint: 'https://rest.cosmos.testedge2.haqq.network',
  },
  11235: {
    id: 11235,
    cosmosChainId: 'haqq_11235-1',
    name: 'HAQQ Mainnet',
    network: 'haqq-mainnet',
    tmRpcEndpoint: 'https://rpc.tm.haqq.network',
    cosmosRestEndpoint: 'https://rest.cosmos.haqq.network',
  },
};
