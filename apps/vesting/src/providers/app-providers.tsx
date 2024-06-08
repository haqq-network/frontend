import { lazy, PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  useWallet,
  WalletProvider,
} from '@haqq/shell-shared';
import { WALLETCONNECT_PROJECT_ID } from '../constants';

export const wagmiConfig = createConfig({
  chains: [haqqMainnet],
  transports: {
    [haqqMainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
  connectors: WALLETCONNECT_PROJECT_ID
    ? [
        walletConnect({
          projectId: WALLETCONNECT_PROJECT_ID,
          disableProviderPing: true,
          qrModalOptions: {
            themeMode: 'light',
          },
        }),
      ]
    : [],
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <WagmiProvider config={wagmiConfig}>
        <ReactQueryProvider>
          <CosmosProvider>
            <WalletProvider>
              {children}
              <Toaster />
              <WalletModals />
            </WalletProvider>
          </CosmosProvider>
        </ReactQueryProvider>
      </WagmiProvider>
    </BrowserRouter>
  );
}

const SelectWalletModal = lazy(async () => {
  const { SelectWalletModal } = await import(
    '../components/select-wallet-modal'
  );
  return { default: SelectWalletModal };
});

function WalletModals() {
  const {
    connectors,
    connect,
    availableConnectors,
    closeSelectWallet,
    connectError,
    setConnectError,
    isSelectWalletOpen,
  } = useWallet();

  return (
    <SelectWalletModal
      connectors={connectors}
      onConnectClick={async (connectorId: number) => {
        try {
          await connect({ connector: availableConnectors[connectorId] });
          closeSelectWallet();
        } catch (error: unknown) {
          setConnectError((error as Error).message);
        }
      }}
      isOpen={isSelectWalletOpen}
      onClose={closeSelectWallet}
      error={connectError ?? ''}
    />
  );
}
