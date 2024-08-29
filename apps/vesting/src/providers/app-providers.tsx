import { PropsWithChildren } from 'react';
import { PostHogProvider } from 'posthog-js/react';
import { BrowserRouter } from 'react-router-dom';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WalletProvider,
} from '@haqq/shell-shared';
import { WalletModals } from '../components/wallet-modals';
import {
  isDev,
  WALLETCONNECT_PROJECT_ID,
  POSTHOG_HOST,
  POSTHOG_KEY,
} from '../constants';

export const wagmiConfig = createConfig({
  chains: [haqqMainnet],
  transports: {
    [haqqMainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
  connectors: WALLETCONNECT_PROJECT_ID
    ? [
        walletConnect({
          projectId: WALLETCONNECT_PROJECT_ID,
          disableProviderPing: true,
          qrModalOptions: {
            themeMode: 'light',
          },
        }),
      ]
    : [],
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <PostHogProvider
      apiKey={POSTHOG_KEY}
      options={{
        api_host: POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
      }}
    >
      <BrowserRouter>
        <WagmiProvider config={wagmiConfig}>
          <ReactQueryProvider withDevtools={isDev}>
            <CosmosProvider>
              <WalletProvider>
                {children}
                <Toaster />
                <WalletModals />
              </WalletProvider>
            </CosmosProvider>
          </ReactQueryProvider>
        </WagmiProvider>
      </BrowserRouter>
    </PostHogProvider>
  );
}
