import type { ChainProperties } from './chains';
import type { Chain as WagmiChain } from 'wagmi';

export function mapToWagmiChain(currentChain: ChainProperties): WagmiChain {
  return {
    id: currentChain.id,
    name: currentChain.name,
    network: currentChain.network,
    nativeCurrency: currentChain.nativeCurrency,
    rpcUrls: {
      default: { http: [currentChain.ethRpcEndpoint] },
      public: { http: [currentChain.ethRpcEndpoint] },
    },
    testnet: currentChain.testnet,
  };
}
