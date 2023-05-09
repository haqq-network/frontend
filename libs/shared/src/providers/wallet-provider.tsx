import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useConfig } from './config-provider';
import { getChainParams } from '../chains/get-chain-params';
import { useConnect, useDisconnect, useNetwork } from 'wagmi';
import MetaMaskOnboarding from '@metamask/onboarding';

interface WalletProviderInterface {
  connect: () => void;
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
  const { chainName } = useConfig();
  const onboardingRef = useRef<MetaMaskOnboarding>();
  const chainProperties = getChainParams(chainName);
  const { chain: currentChain } = useNetwork();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);

  useEffect(() => {
    if (onboardingRef.current !== undefined) {
      onboardingRef.current = new MetaMaskOnboarding();
    }
  }, []);

  const handleWalletConnect = useCallback(() => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboardingRef.current?.startOnboarding();
    } else {
      connect({ connector: connectors[0] });
    }
  }, [connect, connectors]);

  const handleNetworkChange = useCallback(async () => {
    const { ethereum } = window;

    if (ethereum && chainProperties) {
      const chainId = `0x${chainProperties.id.toString(16)}`;

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId,
                  chainName: chainProperties.name,
                  nativeCurrency: chainProperties.nativeCurrency,
                  rpcUrls: [chainProperties.ethRpcEndpoint],
                },
              ],
            });
          } catch (addNetworkError) {
            console.error(addNetworkError);
          }
        }
        console.error(error);
      }
    } else {
      console.warn(
        'useWallet(): handleNetworkChange window.ethereum is undefined',
      );
    }
  }, [chainProperties]);

  const isNetworkSupported = useMemo(() => {
    return currentChain ? !currentChain.unsupported : false;
  }, [currentChain]);

  const memoizedContext = useMemo(() => {
    return {
      connect: handleWalletConnect,
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
    handleWalletConnect,
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
