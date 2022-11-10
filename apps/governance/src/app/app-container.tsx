import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ThemeProvider } from '@haqq/theme';
import { WagmiProvider } from '../providers/wagmi-provider';
import { ReactQueryProvider } from '../providers/react-query-provider';
import { CosmosProvider } from '../providers/cosmos-provider';

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
