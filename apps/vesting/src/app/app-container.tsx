import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { haqqMainnet } from 'viem/chains';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  WagmiProvider,
  WalletProvider,
} from '@haqq/shared';
import { environment } from '../environments/environment';
import { OnboardingContainer } from '../OnboardingContainer';

export function AppContainer({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <WagmiProvider
          walletConnectProjectId={environment.walletConnectProjectId}
          supportedChains={[haqqMainnet]}
        >
          <WalletProvider>
            <CosmosProvider>
              <OnboardingContainer>
                {children}
                <Toaster />
              </OnboardingContainer>
            </CosmosProvider>
          </WalletProvider>
        </WagmiProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  );
}
