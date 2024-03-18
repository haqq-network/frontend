'use client';
import { PropsWithChildren } from 'react';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WagmiProvider,
  WalletProvider,
} from '@haqq/shell-shared';

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider>
      <ReactQueryProvider withDevtools={true}>
        <WalletProvider>
          <CosmosProvider>
            {children}
            <Toaster />
          </CosmosProvider>
        </WalletProvider>
      </ReactQueryProvider>
    </WagmiProvider>
  );
}
