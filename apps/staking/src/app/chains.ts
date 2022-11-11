export interface Chain {
  id: number;
  name: string;
  network: string;
  rpcUrls: {
    [key: string]: string;
    default: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
}

const currency: Chain['nativeCurrency'] = {
  name: 'Islamic Coin',
  symbol: 'ISLM',
  decimals: 18,
};

export const chains: Record<string, Chain> = {
  local: {
    id: 5777,
    name: 'Haqq Localnet',
    network: 'haqq-localnet',
    rpcUrls: {
      default: 'http://127.0.0.1:7545',
    },
    nativeCurrency: currency,
    testnet: true,
  },
  dev: {
    id: 121799,
    name: 'Haqq Devnet',
    network: 'haqq-devnet',
    rpcUrls: {
      default: 'http://159.69.6.222:8545',
    },
    testnet: true,
    nativeCurrency: currency,
  },
  test: {
    id: 53211,
    name: 'Haqq Testedge',
    network: 'haqq-testedge',
    rpcUrls: {
      default: 'https://rpc.eth.testedge.haqq.network',
    },
    testnet: true,
    nativeCurrency: currency,
  },
  test2: {
    id: 54211,
    name: 'Haqq Testedge 2',
    network: 'haqq-testedge2',
    rpcUrls: {
      default: 'https://rpc.eth.testedge2.haqq.network',
    },
    testnet: true,
    nativeCurrency: currency,
  },
  main: {
    id: 11235,
    name: 'Haqq Mainnet',
    network: 'haqq-mainnet',
    rpcUrls: {
      default: 'https://rpc.eth.haqq.network',
    },
    testnet: false,
    nativeCurrency: currency,
  },
};

// export const haqqChain = {
//   chainId: 54211,
//   cosmosChainId: 'haqq_54211-3',
// };

export const haqqChain = {
  chainId: 121799,
  cosmosChainId: 'haqq_121799-1',
};

// TODO: Move to config/environment
// export const cosmosRestEndpoint = 'https://rest.cosmos.testedge2.haqq.network';
// export const tmRpcEndpoint = 'https://rpc.tm.testedge2.haqq.network';
// export const tmRpcWsEndpoint = 'wss://rpc.tm.testedge2.haqq.network';

export const cosmosRestEndpoint = 'http://159.69.6.222:1317';
export const tmRpcEndpoint = 'http://159.69.6.222:26657';
// export const tmRpcWsEndpoint = 'wss://rpc.tm.testedge2.haqq.network';

export function getChainParams(chainName: string) {
  const currentChain = chains[chainName];

  if (!currentChain) {
    throw new Error(`No configuration for ${chainName}`);
  }

  return currentChain;
}
