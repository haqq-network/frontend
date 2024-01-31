import { ReactElement, ReactNode, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { haqqTestedge2 } from '@wagmi/chains';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, WagmiProvider } from '@haqq/shared';
import { environment } from '../environments/environment';

function AuthContainer({ children }: { children: ReactElement }) {
  const auth0ProviderProperties = useMemo(() => {
    const auth0Config = environment.auth0Config;
    if (!auth0Config.domain || !auth0Config.clientId) {
      console.warn(
        'Wrong auth0 configuration. Please check environment variables.',
      );
    }

    return {
      domain: auth0Config.domain ?? '',
      clientId: auth0Config.clientId ?? '',
      redirectUri: window.location.origin,
      useRefreshTokens: true,
    };
  }, []);

  return <Auth0Provider {...auth0ProviderProperties}>{children}</Auth0Provider>;
}

export function AppContainer({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <AuthContainer>
          <WagmiProvider
            walletConnectProjectId={environment.walletConnectConfig.projectId}
            supportedChains={[haqqTestedge2]}
          >
            {children}
          </WagmiProvider>
        </AuthContainer>
      </ConfigProvider>
    </BrowserRouter>
  );
}
