'use client';
import { PropsWithChildren } from 'react';
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
}: PropsWithChildren<{ config: Config }>) {
  return (
    <ConfigProvider config={config}>
      <ReactQueryProvider withDevtools={true}>
        <WagmiProvider
          walletConnectProjectId={config.walletConnectConfig.projectId}
        >
          <CosmosProvider>
            <WalletProvider>
              {children}
              <Toaster />
            </WalletProvider>
          </CosmosProvider>
        </WagmiProvider>
      </ReactQueryProvider>
    </ConfigProvider>
  );
}
