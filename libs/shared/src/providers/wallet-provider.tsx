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
  selectNetwork: (chainId: number) => Promise<void>;
  isNetworkSupported: boolean;
  openSelectWallet: () => void;
  closeSelectWallet: () => void;
  isSelectWalletOpen: boolean;
  openSelectChain: () => void;
  closeSelectChain: () => void;
  isSelectChainOpen: boolean;
}

const WalletContext = createContext<WalletProviderInterface | undefined>(
  undefined,
);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);
  const [isSelectChainModalOpen, setSelectChainModalOpen] = useState(false);

  const handleNetworkChange = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
      } else {
        console.warn('useWallet(): handleNetworkChange error');
      }
    },
    [switchNetworkAsync],
  );

  const isNetworkSupported = useMemo(() => {
    return chain && chain.unsupported !== undefined
      ? !chain.unsupported
      : false;
  }, [chain]);

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
      openSelectChain: () => {
        setSelectChainModalOpen(true);
      },
      closeSelectChain: () => {
        setSelectChainModalOpen(false);
      },
      isSelectChainOpen: isSelectChainModalOpen,
    };
  }, [
    disconnect,
    handleNetworkChange,
    isNetworkSupported,
    isWalletSelectModalOpen,
    isSelectChainModalOpen,
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
