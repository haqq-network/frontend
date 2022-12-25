import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ConfigProvider } from './config-provider';
import { WagmiProvider } from './wagmi-provider';
import { CosmosProvider } from './cosmos-provider';
import { ThemeProvider } from './theme-provider';
import { ReactQueryProvider } from './react-query-provider';
import { Toaster } from 'react-hot-toast';

export function AppProviders({
  children,
  tendermintClient,
  chainName,
  withReactQueryDevtools = false,
}: {
  children: ReactNode;
  tendermintClient: Tendermint34Client;
  chainName: string;
  withReactQueryDevtools?: boolean;
}) {
  return (
    <ConfigProvider chainName={chainName}>
      <BrowserRouter>
        <WagmiProvider>
          <ReactQueryProvider withDevtools={withReactQueryDevtools}>
            <CosmosProvider tendermintClient={tendermintClient}>
              <ThemeProvider>
                {children}
                <Toaster />
              </ThemeProvider>
            </CosmosProvider>
          </ReactQueryProvider>
        </WagmiProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
