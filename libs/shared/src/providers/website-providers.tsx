import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from './config-provider';
import { CosmosProvider } from './cosmos-provider';
import { ReactQueryProvider } from './react-query-provider';
import { WagmiProvider } from './wagmi-provider';
import { WalletProvider } from './wallet-provider';

export function WebsiteProviders({
  children,
  withReactQueryDevtools = false,
  walletConnectProjectId,
  isStandalone = false,
  isProduction = false,
}: PropsWithChildren<{
  withReactQueryDevtools?: boolean;
  walletConnectProjectId?: string;
  isStandalone?: boolean;
  isProduction?: boolean;
}>) {
  return (
    <ConfigProvider isStandalone={isStandalone}>
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
    </ConfigProvider>
  );
}
