'use client';
import { PropsWithChildren, useMemo, createContext, useContext } from 'react';
import { haqqMainnet, haqqTestedge2, Chain as WagmiChain } from '@wagmi/chains';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
import { Connector, WagmiConfig, configureChains, createConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

export type Chain = WagmiChain & {
  unsupported?: boolean | undefined;
};

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
  unsupported: false,
};

const SupportedChainsContext = createContext<Chain[]>([
  haqqMainnet,
  haqqTestedge2,
]);

export function useSupportedChains() {
  const supportedChains = useContext(SupportedChainsContext);

  if (!supportedChains) {
    throw new Error(
      'useSupportedChains should be used only from child of SupportedChainsContext',
    );
  }

  return supportedChains;
}

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
      publicProvider(),
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
    const connectors: Connector[] = [];

    connectors.push(
      new InjectedConnector({
        chains,
        options: {
          shimDisconnect: true,
        },
      }),
    );

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

  return (
    <SupportedChainsContext.Provider value={chains}>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </SupportedChainsContext.Provider>
  );
}
