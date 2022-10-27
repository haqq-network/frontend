import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { hexValue } from 'ethers/lib/utils';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { getChainParams } from './config';
import MetaMaskOnboarding from '@metamask/onboarding';
import { NoMetamaskAlert } from './components/modals/NoMetamaskAlert/NoMetamaskAlert';
import { environment } from './environments/environment';

export type OnboardingSteps =
  | 'start'
  | 'switch-network'
  | 'add-network'
  | 'finish';

export interface OnboardingHook {
  connectWallet: () => Promise<void>;
  startOnboarding: () => void;
  switchNetwork: () => Promise<void>;
  addNetwork: () => Promise<void>;
  step: OnboardingSteps;
  isOnboarded: boolean;
  isConnected: boolean;
  errors: Record<string, Error | undefined>;
  clearError: (errorName: string) => void;
}

const OnboardingContext = createContext<OnboardingHook | undefined>(undefined);

export function OnboardingContainer({ children }: { children: ReactElement }) {
  const chain = getChainParams(environment.chain);
  const targetNetworkIdHex = hexValue(chain.id);
  const onboarding = useRef<MetaMaskOnboarding>();
  const [step, setOnboardingStep] = useState<OnboardingSteps>('start');
  const [isNoMetamaskModalOpen, setNoMetamaskModalOpen] = useState(false);
  const [isOnboarded, setOnboarded] = useState(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [errors, setErrors] = useState<Record<string, Error | undefined>>({});
  const { chain: currentChain } = useNetwork();

  const handleConnectWagmi = useCallback(() => {
    connect({ connector: connectors[0] });
  }, [connect, connectors]);

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  const handleConnectWallet = useCallback(async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      handleConnectWagmi();
    } else {
      setNoMetamaskModalOpen(true);
    }
  }, [handleConnectWagmi]);

  const handleStartOnboarding = useCallback(() => {
    onboarding.current?.startOnboarding();
    setNoMetamaskModalOpen(false);
    setOnboardingStep('switch-network');
  }, []);

  const handleNetworkSwitch = useCallback(async () => {
    // console.log('handleNetworkSwitch');
    const { ethereum } = window;

    if (ethereum) {
      try {
        await ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetNetworkIdHex }],
        });
        setOnboardingStep('finish');
      } catch (error: any) {
        if (error?.code === 4902) {
          setOnboardingStep('add-network');
        } else {
          setErrors({ ...errors, switchNetworkError: error as Error });
        }
      }
    }
  }, [errors, targetNetworkIdHex]);

  const handleNetworkAdd = useCallback(async () => {
    const { ethereum } = window as Window;

    if (ethereum) {
      try {
        await ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: targetNetworkIdHex,
              chainName: chain.name,
              rpcUrls: [chain.rpcUrls.default],
              nativeCurrency: chain.nativeCurrency,
            },
          ],
        });
        setOnboardingStep('finish');
      } catch (error) {
        setErrors({ ...errors, addNetworkError: error as Error });
      }
    }
  }, [
    chain.name,
    chain.nativeCurrency,
    chain.rpcUrls.default,
    errors,
    targetNetworkIdHex,
  ]);

  const clearError = useCallback(
    (errorName: string) => {
      setErrors({ ...errors, [errorName]: undefined });
    },
    [errors],
  );

  useEffect(() => {
    if (address !== undefined) {
      if (currentChain?.unsupported) {
        setOnboardingStep('switch-network');
      } else {
        setOnboardingStep('finish');
      }
    }
  }, [address, currentChain?.unsupported]);

  useEffect(() => {
    if (step === 'finish') {
      onboarding.current?.stopOnboarding();
      setOnboarded(true);
    }
  }, [step]);

  const memoizedHook = useMemo<OnboardingHook>(() => {
    return {
      connectWallet: handleConnectWallet,
      startOnboarding: handleStartOnboarding,
      switchNetwork: handleNetworkSwitch,
      addNetwork: handleNetworkAdd,
      step,
      isOnboarded,
      isConnected,
      errors,
      clearError,
    };
  }, [
    handleConnectWallet,
    handleNetworkAdd,
    handleNetworkSwitch,
    handleStartOnboarding,
    isOnboarded,
    isConnected,
    step,
    errors,
    clearError,
  ]);

  return (
    <OnboardingContext.Provider value={memoizedHook}>
      {children}

      <NoMetamaskAlert
        isOpen={isNoMetamaskModalOpen}
        onStartOnboarding={handleStartOnboarding}
        onClose={() => setNoMetamaskModalOpen(false)}
      />
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingHook {
  const onboarding = useContext(OnboardingContext);

  if (!onboarding) {
    throw new Error(
      'useOnboarding should be used only from child of OnboardingContext',
    );
  }

  return onboarding;
}
