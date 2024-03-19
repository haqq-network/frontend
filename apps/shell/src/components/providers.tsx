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
      <WagmiProvider>
        <ReactQueryProvider withDevtools={true}>
          <CosmosProvider>
            <WalletProvider>
              {children}
              <Toaster />
            </WalletProvider>
          </CosmosProvider>
        </ReactQueryProvider>
      </WagmiProvider>
    </ConfigProvider>
  );
}
