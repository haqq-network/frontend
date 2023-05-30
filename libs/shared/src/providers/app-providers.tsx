import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from './config-provider';
import { WagmiProvider } from './wagmi-provider';
import { CosmosProvider } from './cosmos-provider';
import { ReactQueryProvider } from './react-query-provider';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './wallet-provider';

export function AppProviders({
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
      <BrowserRouter>
        <WagmiProvider
          walletConnectProjectId={walletConnectProjectId}
          isProduction={isProduction}
        >
          <WalletProvider>
            <CosmosProvider>
              <ReactQueryProvider withDevtools={withReactQueryDevtools}>
                {children}
                <Toaster />
              </ReactQueryProvider>
            </CosmosProvider>
          </WalletProvider>
        </WagmiProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
