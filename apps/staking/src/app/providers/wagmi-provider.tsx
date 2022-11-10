import { ReactNode, useMemo } from 'react';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { getChainParams } from '../chains';
import { environment } from '../../environments/environment';

export function WagmiProvider({ children }: { children: ReactNode }) {
  const { provider, chains } = useMemo(() => {
    const chain = getChainParams(environment.chain) as Chain;
    console.log({ chain });
    return configureChains(
      [chain as Chain],
      [
        jsonRpcProvider({
          rpc: (chain: Chain) => {
            return {
              http: chain.rpcUrls.default,
              // webSocket: chain.rpcUrls.ws,
            };
          },
        }),
      ],
    );
  }, []);

  const connectors = useMemo(() => {
    return [
      // new WalletConnectConnector({
      //   chains,
      //   options: {},
      // }),
      new InjectedConnector({
        chains,
      }),
    ];
  }, [chains]);

  const client = useMemo(() => {
    return createClient({
      provider,
      connectors,
      autoConnect: true,
    });
  }, [connectors, provider]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
