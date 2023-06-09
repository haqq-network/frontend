import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { environment } from '../environments/environment';
import { OnboardingContainer } from '../OnboardingContainer';
import { WagmiProvider } from '@haqq/shared';
import { haqqMainnet } from '@wagmi/chains';

export function AppContainer({ children }: { children: ReactElement }) {
  return (
    <BrowserRouter>
      <WagmiProvider
        walletConnectProjectId={environment.walletConnectProjectId}
        supportedChains={[haqqMainnet]}
      >
        <OnboardingContainer>{children}</OnboardingContainer>
      </WagmiProvider>
    </BrowserRouter>
  );
}
