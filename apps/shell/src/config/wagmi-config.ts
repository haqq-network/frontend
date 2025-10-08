import { Transport } from 'viem';
import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  CreateConnectorFn,
} from 'wagmi';
import { safe, walletConnect } from 'wagmi/connectors';
import { supportedChains } from '@haqq/shell-shared';

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

  connectors.push(
    safe({
      debug: true,
      unstable_getInfoTimeout: 1000,
    }),
  );

  return createConfig({
    chains: supportedChains,
    transports: supportedChainsTransports,
    connectors,
    ssr: true,
    multiInjectedProviderDiscovery: true,
    batch: { multicall: true },
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
}
