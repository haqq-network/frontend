import { ReactElement, ReactNode, useMemo } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ThemeContainer } from '../components/ThemeContainer';
import { environment } from '../environments/environment';
import { getChainParams } from '../config';

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

function WagmiContainer({ children }: { children: ReactElement }) {
  const chain = getChainParams(environment.chain);
  const { provider, webSocketProvider, chains } = useMemo(() => {
    return configureChains(
      [chain as Chain],
      [
        jsonRpcProvider({
          rpc: (chain: Chain) => {
            return {
              http: chain.rpcUrls.default,
            };
          },
        }),
      ],
    );
  }, []);

  const connectors = useMemo(() => {
    return [
      new WalletConnectConnector({
        chains,
        options: {},
      }),
      new InjectedConnector({
        chains,
      }),
    ];
  }, [chains]);

  const client = useMemo(() => {
    return createClient({
      provider,
      webSocketProvider,
      connectors,
      autoConnect: true,
    });
  }, [connectors, provider, webSocketProvider]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}

export function AppContainer({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <AuthContainer>
      <WagmiContainer>
        <ThemeContainer>{children}</ThemeContainer>
      </WagmiContainer>
    </AuthContainer>
  );
}
