'use client';
import { PropsWithChildren } from 'react';
import { DehydratedState } from '@tanstack/react-query';
import { Config, State, WagmiProvider } from 'wagmi';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  UserAgentProvider,
  WalletProvider,
} from '@haqq/shell-shared';
import { WalletModals } from '../components/wallet-modals';
import { createWagmiConfig } from '../config/wagmi-config';

export function AppProviders({
  initialState,
  walletConnectProjectId,
  children,
  dehydratedState,
  wagmiConfig,
  userAgent,
}: PropsWithChildren<{
  initialState: State | undefined;
  walletConnectProjectId?: string;
  dehydratedState?: DehydratedState;
  wagmiConfig?: Config;
  userAgent: string | null;
}>) {
  const actualWagmiConfig = wagmiConfig
    ? wagmiConfig
    : createWagmiConfig(walletConnectProjectId);

  return (
    <WagmiProvider config={actualWagmiConfig} initialState={initialState}>
      <ReactQueryProvider withDevtools dehydratedState={dehydratedState}>
        <CosmosProvider>
          <WalletProvider>
            <UserAgentProvider userAgent={userAgent}>
              {children}
            </UserAgentProvider>
            <Toaster />
            <WalletModals />
          </WalletProvider>
        </CosmosProvider>
      </ReactQueryProvider>
    </WagmiProvider>
  );
}
