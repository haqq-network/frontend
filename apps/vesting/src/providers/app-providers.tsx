import { lazy, PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { haqqMainnet } from 'wagmi/chains';
// import { injected } from 'wagmi/connectors';
import {
  CosmosProvider,
  ReactQueryProvider,
  Toaster,
  useWallet,
  WalletProvider,
} from '@haqq/shell-shared';

export const wagmiConfig = createConfig({
  chains: [haqqMainnet],
  transports: {
    [haqqMainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
  // connectors: [
  //   injected({
  //     shimDisconnect: false,
  //     unstable_shimAsyncInject: 2_000,
  //   }),
  // ],
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <WagmiProvider config={wagmiConfig}>
        <ReactQueryProvider withDevtools>
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
    <>
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
    </>
  );
}
