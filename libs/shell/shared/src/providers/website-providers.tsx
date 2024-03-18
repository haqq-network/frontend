import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { CosmosProvider } from './cosmos-provider';
import { ReactQueryProvider } from './react-query-provider';
import { WagmiProvider } from './wagmi-provider';
import { WalletProvider } from './wallet-provider';

export function WebsiteProviders({
  children,
  withReactQueryDevtools = false,
  walletConnectProjectId,
  isProduction = false,
}: PropsWithChildren<{
  withReactQueryDevtools?: boolean;
  walletConnectProjectId?: string;
  isProduction?: boolean;
}>) {
  return (
    <ReactQueryProvider withDevtools={withReactQueryDevtools}>
      <WagmiProvider
        walletConnectProjectId={walletConnectProjectId}
        isProduction={isProduction}
      >
        <WalletProvider>
          <CosmosProvider>
            {children}
            <Toaster />
          </CosmosProvider>
        </WalletProvider>
      </WagmiProvider>
    </ReactQueryProvider>
  );
}
