import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { environment } from '../environments/environment';
import { OnboardingContainer } from '../OnboardingContainer';
import { ConfigProvider, WagmiProvider } from '@haqq/shared';

export function AppContainer({ children }: { children: ReactElement }) {
  return (
    <ConfigProvider chainName={environment.chainName}>
      <BrowserRouter>
        <WagmiProvider
          walletConnectProjectId={environment.walletConnectProjectId}
        >
          <OnboardingContainer>{children}</OnboardingContainer>
        </WagmiProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
