import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ThemeProvider } from '@haqq/theme';
import {
  CosmosProvider,
  ConfigProvider,
  ReactQueryProvider,
  WagmiProvider,
} from '@haqq/providers';
import { environment } from '../environments/environment';

export function AppContainer({
  children,
  tendermintClient,
}: {
  children: ReactNode;
  tendermintClient: Tendermint34Client;
}) {
  return (
    <ConfigProvider chainName={environment.chainName}>
      <BrowserRouter>
        <WagmiProvider>
          <ReactQueryProvider>
            <CosmosProvider tendermintClient={tendermintClient}>
              <ThemeProvider>{children}</ThemeProvider>
            </CosmosProvider>
          </ReactQueryProvider>
        </WagmiProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
