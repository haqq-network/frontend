import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  // CreateConnectorFn,
} from 'wagmi';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
// import { injected, walletConnect } from 'wagmi/connectors';

export function createWagmiConfig(walletConnectProjectId?: string) {
  // const connectors: CreateConnectorFn[] = [injected()];

  // if (walletConnectProjectId) {
  //   connectors.push(walletConnect({ projectId: 'walletConnectProjectId' }));
  // }

  return createConfig({
    chains: [haqqMainnet, haqqTestedge2],
    transports: {
      [haqqMainnet.id]: http(),
      [haqqTestedge2.id]: http(),
    },
    ssr: true,
    // multiInjectedProviderDiscovery: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    // connectors,
  });
}
