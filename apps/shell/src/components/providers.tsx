'use client';
import { PropsWithChildren } from 'react';
import { Context as ResponsiveContext } from 'react-responsive';
import {
  Config,
  ConfigProvider,
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WagmiProvider,
  WalletProvider,
} from '@haqq/shell-shared';

export function Providers({
  children,
  config,
  isMobileUserAgent,
}: PropsWithChildren<{ config: Config; isMobileUserAgent?: boolean }>) {
  const possibleDevice = isMobileUserAgent ? { width: 375 } : { width: 1280 };

  return (
    <ConfigProvider config={config}>
      <ReactQueryProvider withDevtools={true}>
        <WagmiProvider
          walletConnectProjectId={config.walletConnectConfig.projectId}
        >
          <CosmosProvider>
            <WalletProvider>
              <ResponsiveContext.Provider value={possibleDevice}>
                {children}
                <Toaster />
              </ResponsiveContext.Provider>
            </WalletProvider>
          </CosmosProvider>
        </WagmiProvider>
      </ReactQueryProvider>
    </ConfigProvider>
  );
}
