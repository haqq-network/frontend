'use client';
import { PropsWithChildren, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

export function AuthProvider({
  children,
  config = {},
}: PropsWithChildren<{
  config?: {
    auth0Domain?: string;
    auth0ClientId?: string;
  };
}>) {
  const auth0ProviderProperties = useMemo(() => {
    if (!config.auth0Domain || !config.auth0ClientId) {
      console.warn(
        'Wrong auth0 configuration. Please check environment variables.',
      );
    }

    if (typeof window === 'undefined') {
      console.warn('Auth0Provider is not supported on the server side.');
    }

    return {
      domain: config.auth0Domain ?? '',
      clientId: config.auth0ClientId ?? '',
      useRefreshTokens: true,
    };
  }, [config.auth0ClientId, config.auth0Domain]);

  return (
    <Auth0Provider
      {...auth0ProviderProperties}
      authorizationParams={{
        redirect_uri:
          typeof window !== 'undefined' ? window.location.origin : '',
      }}
    >
      {children}
    </Auth0Provider>
  );
}
