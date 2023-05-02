import { ReactNode, useMemo } from 'react';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
import { useConfig } from './config-provider';
import { getChainParams } from '../chains/get-chain-params';
import { mapToWagmiChain } from '../chains/map-to-wagmi-chain';

export function WagmiProvider({
  children,
  walletConnectProjectId,
}: {
  children: ReactNode;
  walletConnectProjectId?: string;
}) {
  const { chainName } = useConfig();
  const { provider, chains } = useMemo(() => {
    const chainParams = getChainParams(chainName);
    const chain = mapToWagmiChain(chainParams);

    return configureChains(
      [chain as Chain],
      [
        jsonRpcProvider({
          rpc: (chain: Chain) => {
            return {
              http: chain.rpcUrls.default.http[0] ?? '',
              // webSocket: chain.rpcUrls.ws,
            };
          },
        }),
      ],
    );
  }, [chainName]);

  const connectors = useMemo(() => {
    const connectors: Array<any> = [
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
    ];

    if (walletConnectProjectId) {
      connectors.push(
        new WalletConnectConnector({
          chains,
          options: {
            projectId: walletConnectProjectId,
            showQrModal: true,
          },
        }),
      );
    }

    return connectors;
  }, [chains, walletConnectProjectId]);

  const client = useMemo(() => {
    return createClient({
      provider,
      connectors,
      autoConnect: true,
    });
  }, [connectors, provider]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
