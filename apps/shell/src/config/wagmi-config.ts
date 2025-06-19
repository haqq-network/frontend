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

const haqqDevnet1 = {
  id: 54211,
  name: 'HAQQ Devnet 1',
  nativeCurrency: {
    decimals: 18,
    name: 'Islamic Coin',
    symbol: 'ISLMT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.eth.testedge2.haqq.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HAQQ Explorer',
      url: 'https://explorer.testedge2.haqq.network',
      apiUrl: 'https://explorer.testedge2.haqq.network/api',
    },
  },
};

export const supportedChains = [
  haqqMainnet,
  haqqTestedge2,
  haqqDevnet1,
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
