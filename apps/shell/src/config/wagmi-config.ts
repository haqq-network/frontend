import { Transport } from 'viem';
import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  CreateConnectorFn,
} from 'wagmi';
import { haqqMainnet, haqqTestedge2, sepolia } from 'wagmi/chains';
import { safe, walletConnect } from 'wagmi/connectors';
import { haqqDevnet1 } from '@haqq/shell-shared';

export const bridgeSupportedChains = [haqqDevnet1, sepolia];

export const supportedChains = [
  haqqMainnet,
  haqqTestedge2,
  ...bridgeSupportedChains,
] as const;

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
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
}
