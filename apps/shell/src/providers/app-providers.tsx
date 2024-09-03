'use client';
import { PropsWithChildren } from 'react';
import { DehydratedState } from '@tanstack/react-query';
import { State, WagmiProvider, Config } from 'wagmi';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  IsMobileUAProvider,
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
  isMobileUA,
}: PropsWithChildren<{
  initialState: State | undefined;
  walletConnectProjectId?: string;
  dehydratedState?: DehydratedState;
  wagmiConfig?: Config;
  isMobileUA: boolean;
}>) {
  const actualWagmiConfig = wagmiConfig
    ? wagmiConfig
    : createWagmiConfig(walletConnectProjectId);

  return (
    <IsMobileUAProvider isMobileUA={isMobileUA}>
      <WagmiProvider config={actualWagmiConfig} initialState={initialState}>
        <ReactQueryProvider withDevtools dehydratedState={dehydratedState}>
          <CosmosProvider>
            <WalletProvider>
              {children}
              <Toaster />
              <WalletModals />
            </WalletProvider>
          </CosmosProvider>
        </ReactQueryProvider>
      </WagmiProvider>
    </IsMobileUAProvider>
  );
}
