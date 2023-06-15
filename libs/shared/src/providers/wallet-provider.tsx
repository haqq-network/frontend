import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
// import { useConfig } from './config-provider';
// import { getChainParams } from '../chains/get-chain-params';
import {
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';
import { SelectWalletModal } from '@haqq/shell-ui-kit';
import '@wagmi/core/window';

export interface WalletProviderInterface {
  disconnect: () => void;
  selectNetwork: () => Promise<void>;
  isNetworkSupported: boolean;
  openSelectWallet: () => void;
  closeSelectWallet: () => void;
  isSelectWalletOpen: boolean;
}

const WalletContext = createContext<WalletProviderInterface | undefined>(
  undefined,
);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);

  const handleWalletConnect = useCallback(
    async (connectorIdx: number) => {
      await connectAsync({ connector: connectors[connectorIdx] });
    },
    [connectAsync, connectors],
  );

  const handleNetworkChange = useCallback(async () => {
    if (chain && switchNetworkAsync) {
      await switchNetworkAsync(chain.id);
    } else {
      console.warn('useWallet(): handleNetworkChange error');
    }
  }, [chain, switchNetworkAsync]);

  const isNetworkSupported = useMemo(() => {
    return chain ? !chain.unsupported : false;
  }, [chain]);

  const selectWalletModalConnectors = useMemo(() => {
    return connectors.map((connector, index) => {
      return {
        id: index,
        name: connector.name,
        isPending: isLoading && pendingConnector?.id === connector.id,
      };
    });
  }, [connectors, isLoading, pendingConnector?.id]);

  const memoizedContext = useMemo(() => {
    return {
      disconnect,
      selectNetwork: handleNetworkChange,
      isNetworkSupported,
      openSelectWallet: () => {
        setWalletSelectModalOpen(true);
      },
      closeSelectWallet: () => {
        setWalletSelectModalOpen(false);
      },
      isSelectWalletOpen: isWalletSelectModalOpen,
    };
  }, [
    disconnect,
    handleNetworkChange,
    isNetworkSupported,
    setWalletSelectModalOpen,
    isWalletSelectModalOpen,
  ]);

  return (
    <WalletContext.Provider value={memoizedContext}>
      {children}

      <SelectWalletModal
        isOpen={isWalletSelectModalOpen}
        connectors={selectWalletModalConnectors}
        error={error ? error.message : undefined}
        onConnectClick={handleWalletConnect}
        onClose={() => {
          setWalletSelectModalOpen(false);
        }}
      />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const walletService = useContext(WalletContext);

  if (!walletService) {
    throw new Error(
      'useWallet should be used only from child of WalletProvider',
    );
  }

  return walletService;
}
