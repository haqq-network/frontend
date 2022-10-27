import { useMemo, ReactElement } from 'react';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { BrowserRouter } from 'react-router-dom';
import { getChainParams } from '../config';
import { environment } from '../environments/environment';
import { OnboardingContainer } from '../OnboardingContainer';

export function WagmiContainer({ children }: { children: ReactElement }) {
  const chain: Chain = getChainParams(environment.chain);

  const {
    provider,
    // webSocketProvider,
    chains,
  } = useMemo(() => {
    return configureChains(
      [chain],
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
  }, [chain]);

  const client = useMemo(() => {
    return createClient({
      provider,
      // webSocketProvider,
      connectors: [
        new MetaMaskConnector({ chains }),
        // new InjectedConnector({ chains }),
      ],
      autoConnect: true,
    });
  }, [chains, provider]);

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}

export function AppContainer({ children }: { children: ReactElement }) {
  return (
    <BrowserRouter>
      <WagmiContainer>
        <OnboardingContainer>{children}</OnboardingContainer>
      </WagmiContainer>
    </BrowserRouter>
  );
}
