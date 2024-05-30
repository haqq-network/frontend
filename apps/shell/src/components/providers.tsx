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

function ResponsiveProvider({
  children,
  isMobileUserAgent,
}: PropsWithChildren<{ isMobileUserAgent?: boolean }>) {
  if (!isMobileUserAgent) {
    return children;
  }

  return (
    <ResponsiveContext.Provider value={{ width: 375 }}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function Providers({
  children,
  config,
  isMobileUserAgent,
}: PropsWithChildren<{ config: Config; isMobileUserAgent?: boolean }>) {
  return (
    <ConfigProvider config={config}>
      <ReactQueryProvider withDevtools={true}>
        <WagmiProvider
          walletConnectProjectId={config.walletConnectConfig.projectId}
        >
          <CosmosProvider>
            <WalletProvider>
              <ResponsiveProvider isMobileUserAgent={isMobileUserAgent}>
                {children}
                <Toaster />
              </ResponsiveProvider>
            </WalletProvider>
          </CosmosProvider>
        </WagmiProvider>
      </ReactQueryProvider>
    </ConfigProvider>
  );
}
