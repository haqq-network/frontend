import { ReactElement } from 'react';
import { haqqMainnet } from '@wagmi/chains';
import { BrowserRouter } from 'react-router-dom';
import {
  CosmosProvider,
  ReactQueryProvider,
  WagmiProvider,
} from '@haqq/shared';
import { environment } from '../environments/environment';
import { OnboardingContainer } from '../OnboardingContainer';

export function AppContainer({ children }: { children: ReactElement }) {
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <WagmiProvider
          walletConnectProjectId={environment.walletConnectProjectId}
          supportedChains={[haqqMainnet]}
        >
          <CosmosProvider>
            <OnboardingContainer>{children}</OnboardingContainer>
          </CosmosProvider>
        </WagmiProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  );
}
