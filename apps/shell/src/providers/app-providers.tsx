'use client';
import { PropsWithChildren } from 'react';
import { DehydratedState } from '@tanstack/react-query';
import { State, WagmiProvider, Config } from 'wagmi';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WalletProvider,
  WalletModals,
} from '@haqq/shell-shared';
// import { Context as ResponsiveContext } from 'react-responsive';
import { createWagmiConfig } from '../config/wagmi-config';

export function AppProviders({
  initialState,
  walletConnectProjectId,
  children,
  dehydratedState,
  wagmiConfig,
}: PropsWithChildren<{
  initialState: State | undefined;
  walletConnectProjectId?: string;
  dehydratedState?: DehydratedState;
  wagmiConfig?: Config;
}>) {
  const actualWagmiConfig = wagmiConfig
    ? wagmiConfig
    : createWagmiConfig(walletConnectProjectId);

  return (
    <WagmiProvider config={actualWagmiConfig} initialState={initialState}>
      <ReactQueryProvider withDevtools dehydratedState={dehydratedState}>
        <CosmosProvider>
          <WalletProvider>
            {/* <ResponsiveContext.Provider value={{ width: 500 }}> */}
            {children}
            <Toaster />
            <WalletModals />
            {/* </ResponsiveContext.Provider> */}
          </WalletProvider>
        </CosmosProvider>
      </ReactQueryProvider>
    </WagmiProvider>
  );
}
