import { PropsWithChildren, useMemo } from 'react';
import { Connector, WagmiConfig, configureChains, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { haqqMainnet, haqqTestedge2, Chain } from '@wagmi/chains';

export const haqqLocalnet: Chain = {
  id: 121799,
  name: 'HAQQ Localnet',
  network: 'haqq-localnet-1',
  nativeCurrency: {
    decimals: 18,
    name: 'Islamic Coin',
    symbol: 'ISLMT',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
};

export function WagmiProvider({
  children,
  walletConnectProjectId,
  isProduction = true,
  supportedChains = [haqqMainnet, haqqTestedge2],
}: PropsWithChildren<{
  walletConnectProjectId?: string;
  isProduction?: boolean;
  supportedChains?: Chain[];
}>) {
  const { publicClient, webSocketPublicClient, chains } = useMemo(() => {
    const configuredChains: Chain[] = [...supportedChains];

    if (!isProduction) {
      configuredChains.push(haqqLocalnet);
    }

    return configureChains(configuredChains, [
      jsonRpcProvider({
        rpc: (chain) => {
          return {
            http: chain.rpcUrls.default.http[0],
          };
        },
      }),
    ]);
  }, [isProduction, supportedChains]);

  const connectors = useMemo(() => {
    const connectors: Connector[] = [
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

  const config = useMemo(() => {
    return createConfig({
      publicClient,
      webSocketPublicClient,
      connectors,
      autoConnect: true,
    });
  }, [connectors, publicClient, webSocketPublicClient]);

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
