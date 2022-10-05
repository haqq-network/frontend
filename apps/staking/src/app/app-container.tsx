import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryProvider } from './providers/react-query-provider';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { CosmosProvider } from './providers/cosmos-provider';
import { WagmiProvider } from './providers/wagmi-provider';
import { ThemeProvider } from '@haqq/theme';

export function AppContainer({
  children,
  tendermintClient,
}: {
  children: ReactNode;
  tendermintClient: Tendermint34Client;
}) {
  return (
    <BrowserRouter>
      <WagmiProvider>
        <ReactQueryProvider>
          <CosmosProvider tendermintClient={tendermintClient}>
            <ThemeProvider>{children}</ThemeProvider>
          </CosmosProvider>
        </ReactQueryProvider>
      </WagmiProvider>
    </BrowserRouter>
  );
}
