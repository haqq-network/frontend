import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
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
  const { disconnect } = useDisconnect();
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);

  const handleNetworkChange = useCallback(async () => {
    if (chain && switchNetworkAsync) {
      await switchNetworkAsync(chain.id);
    } else {
      console.warn('useWallet(): handleNetworkChange error');
    }
  }, [chain, switchNetworkAsync]);

  const isNetworkSupported = useMemo(() => {
    return chain && chain.unsupported !== undefined
      ? !chain.unsupported
      : false;
  }, [chain]);

  const memoizedContext = useMemo(() => {
    return {
      chains: [],
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
