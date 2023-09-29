import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { environment } from '../environments/environment';
import { OnboardingContainer } from '../OnboardingContainer';
import {
  CosmosProvider,
  ReactQueryProvider,
  WagmiProvider,
} from '@haqq/shared';
import { haqqMainnet } from '@wagmi/chains';

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
