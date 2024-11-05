import { Transport } from 'viem';
import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  CreateConnectorFn,
} from 'wagmi';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

export const supportedChains = [haqqMainnet, haqqTestedge2] as const;
export const supportedChainsIds = supportedChains.map((chain): number => {
  return chain.id;
});
const supportedChainsTransports = supportedChains.reduce(
  (acc, chain) => {
    acc[chain.id] = http();
    return acc;
  },
  {} as Record<number, Transport>,
);

export function createWagmiConfig(walletConnectProjectId?: string) {
  const connectors: CreateConnectorFn[] = [];

  if (walletConnectProjectId) {
    connectors.push(
      walletConnect({
        projectId: walletConnectProjectId,
        disableProviderPing: true,
        qrModalOptions: {
          themeMode: 'dark',
        },
        showQrModal: true,
      }),
    );
  }

  return createConfig({
    chains: supportedChains,
    transports: supportedChainsTransports,
    connectors,
    ssr: true,
    multiInjectedProviderDiscovery: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
}
