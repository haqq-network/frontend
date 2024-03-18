'use client';
import { PropsWithChildren, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

export function AuthProvider({
  children,
  auth0Config,
}: PropsWithChildren<{ auth0Config: { domain: string; clientId: string } }>) {
  const auth0ProviderProperties = useMemo(() => {
    if (!auth0Config.domain || !auth0Config.clientId) {
      console.warn(
        'Wrong auth0 configuration. Please check environment variables.',
      );
    }

    if (typeof window === 'undefined') {
      console.warn('Auth0Provider is not supported on the server side.');
    }

    return {
      domain: auth0Config.domain ?? '',
      clientId: auth0Config.clientId ?? '',
      redirectUri: window?.location.origin ?? '',
      useRefreshTokens: true,
    };
  }, [auth0Config.clientId, auth0Config.domain]);

  return <Auth0Provider {...auth0ProviderProperties}>{children}</Auth0Provider>;
}
