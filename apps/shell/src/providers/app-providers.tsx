'use client';
import { PropsWithChildren } from 'react';
import { DehydratedState } from '@tanstack/react-query';
import { State, WagmiProvider, Config } from 'wagmi';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WalletProvider,
  LayoutProvider,
  FeatureFlagsProvider,
} from '@haqq/shell-shared';
import { WalletModals } from '../components/wallet-modals';
import { createWagmiConfig } from '../config/wagmi-config';
import { env } from '../env/client';
import { TolgeeNextProvider } from '../tolgee/client';

export function AppProviders({
  initialState,
  walletConnectProjectId,
  children,
  dehydratedState,
  wagmiConfig,
  isMobileUA,
  locales,
  locale,
}: PropsWithChildren<{
  initialState: State | undefined;
  walletConnectProjectId?: string;
  dehydratedState?: DehydratedState;
  wagmiConfig?: Config;
  isMobileUA: boolean;
  locales: Record<string, any>;
  locale: string;
}>) {
  const actualWagmiConfig = wagmiConfig
    ? wagmiConfig
    : createWagmiConfig(walletConnectProjectId);
  const featureFlags = {
    LIQUID_STAKING: env.NEXT_PUBLIC_FEATURE_LIQUID_STAKING_ENABLED,
  };

  return (
    <FeatureFlagsProvider featureFlags={featureFlags}>
      <WagmiProvider config={actualWagmiConfig} initialState={initialState}>
        <ReactQueryProvider withDevtools dehydratedState={dehydratedState}>
          <CosmosProvider>
            <WalletProvider>
              <TolgeeNextProvider locale={locale} locales={locales}>
                <LayoutProvider isMobileUA={isMobileUA}>
                  {children}
                  <Toaster />
                </LayoutProvider>
              </TolgeeNextProvider>
              <WalletModals isMobileUA={isMobileUA} />
            </WalletProvider>
          </CosmosProvider>
        </ReactQueryProvider>
      </WagmiProvider>
    </FeatureFlagsProvider>
  );
}
