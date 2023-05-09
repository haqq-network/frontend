import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ConfigProvider } from './config-provider';
import { WagmiProvider } from './wagmi-provider';
import { CosmosProvider } from './cosmos-provider';
import { ThemeProvider } from './theme-provider';
import { ReactQueryProvider } from './react-query-provider';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './wallet-provider';

export function AppProviders({
  children,
  tendermintClient,
  chainName,
  withReactQueryDevtools = false,
  walletConnectProjectId,
}: {
  children: ReactNode;
  tendermintClient: Tendermint34Client;
  chainName: string;
  withReactQueryDevtools?: boolean;
  walletConnectProjectId?: string;
}) {
  return (
    <ConfigProvider chainName={chainName}>
      <BrowserRouter>
        <WagmiProvider walletConnectProjectId={walletConnectProjectId}>
          <WalletProvider>
            <ReactQueryProvider withDevtools={withReactQueryDevtools}>
              <CosmosProvider tendermintClient={tendermintClient}>
                <ThemeProvider>
                  {children}
                  <Toaster />
                </ThemeProvider>
              </CosmosProvider>
            </ReactQueryProvider>
          </WalletProvider>
        </WagmiProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
