import { ReactNode, useMemo } from 'react';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { getChainParams } from '../chains';
import { environment } from '../../environments/environment';

export function WagmiProvider({ children }: { children: ReactNode }) {
  const chain = getChainParams(environment.chain) as Chain;

  const {
    provider,
    // webSocketProvider,
    chains,
  } = useMemo(() => {
    return configureChains(
      [chain],
      [
        jsonRpcProvider({
          rpc: (chain) => {
            return {
              http: chain.rpcUrls.default,
              // webSocket: chain.rpcUrls.ws,
            };
          },
        }),
      ],
    );
  }, [chain]);

  const client = useMemo(() => {
    return createClient({
      provider,
      // webSocketProvider,
      connectors: [
        // new MetaMaskConnector({ chains }),
        new InjectedConnector({ chains }),
      ],
      autoConnect: true,
    });
  }, [chains, provider]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
