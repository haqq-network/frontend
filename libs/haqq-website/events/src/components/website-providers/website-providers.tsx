'use client';
import { PropsWithChildren } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WalletProvider,
} from '@haqq/shell-shared';

export function WebsiteProviders({
  children,
  withReactQueryDevtools = false,
  walletConnectProjectId,
  isProduction = false,
}: PropsWithChildren<{
  withReactQueryDevtools?: boolean;
  walletConnectProjectId?: string;
  isProduction?: boolean;
}>) {
  const wagmiConfig = createConfig({
    chains: [haqqMainnet],
    transports: {
      [haqqMainnet.id]: http(),
    },
    multiInjectedProviderDiscovery: true,
    // connectors: [
    //   injected({
    //     shimDisconnect: false,
    //     unstable_shimAsyncInject: 2_000,
    //   }),
    // ],
  });

  return (
    <WagmiProvider
      config={wagmiConfig}
      // walletConnectProjectId={walletConnectProjectId}
      // isProduction={isProduction}
    >
      <ReactQueryProvider withDevtools={withReactQueryDevtools}>
        <CosmosProvider>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </CosmosProvider>
      </ReactQueryProvider>
    </WagmiProvider>
  );
}
