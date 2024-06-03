import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  CreateConnectorFn,
} from 'wagmi';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

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
      }),
    );
  }

  return createConfig({
    chains: [haqqMainnet, haqqTestedge2],
    transports: {
      [haqqMainnet.id]: http(),
      [haqqTestedge2.id]: http(),
    },
    connectors,
    ssr: true,
    multiInjectedProviderDiscovery: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
}
