'use client';
import { PropsWithChildren, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useConfig } from '@haqq/shell-shared';

export function AuthProvider({ children }: PropsWithChildren) {
  const { faucetConfig } = useConfig();

  const auth0ProviderProperties = useMemo(() => {
    if (!faucetConfig.auth0Domain || !faucetConfig.auth0ClientId) {
      console.warn(
        'Wrong auth0 configuration. Please check environment variables.',
      );
    }

    if (typeof window === 'undefined') {
      console.warn('Auth0Provider is not supported on the server side.');
    }

    return {
      domain: faucetConfig.auth0Domain ?? '',
      clientId: faucetConfig.auth0ClientId ?? '',
      redirectUri: window?.location.origin ?? '',
      useRefreshTokens: true,
    };
  }, [faucetConfig.auth0ClientId, faucetConfig.auth0Domain]);

  return <Auth0Provider {...auth0ProviderProperties}>{children}</Auth0Provider>;
}
