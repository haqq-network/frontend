import { createConfig, http } from 'wagmi';
import { haqqTestedge2 } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

export const supportedChainsIds = [haqqTestedge2.id] as const;

export function createWagmiConfig(walletConnectProjectId?: string) {
  return createConfig({
    chains: [haqqTestedge2],
    transports: {
      [haqqTestedge2.id]: http(),
    },
    connectors: walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            showQrModal: true,
          }),
        ]
      : [],
    multiInjectedProviderDiscovery: true,
    ssr: true,
  });
}
