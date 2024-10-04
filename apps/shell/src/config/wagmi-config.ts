import { Transport } from 'viem';
import {
  createConfig,
  http,
  createStorage,
  cookieStorage,
  CreateConnectorFn,
} from 'wagmi';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import { safe, walletConnect } from 'wagmi/connectors';

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

  // if (walletConnectProjectId) {
  //   connectors.push(
  //     walletConnect({
  //       projectId: walletConnectProjectId,
  //       disableProviderPing: true,
  //       qrModalOptions: {
  //         themeMode: 'dark',
  //       },
  //     }),
  //   );
  // }

  connectors.push(
    safe({
      allowedDomains: [/^app\.safe\.global$/, /^safe\.haqq\.network$/],
      debug: true,
      shimDisconnect: true,
      unstable_getInfoTimeout: 10000,
    }),
  );

  return createConfig({
    chains: supportedChains,
    transports: supportedChainsTransports,
    connectors,
    // ssr: true,
    multiInjectedProviderDiscovery: false,
    // storage: createStorage({
    //   storage: cookieStorage,
    // }),
  });
}
