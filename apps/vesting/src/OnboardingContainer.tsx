import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { SelectWalletModal } from './components/modals/SelectWalletModal';

export type OnboardingSteps =
  | 'start'
  | 'switch-network'
  | 'add-network'
  | 'finish';

export interface OnboardingHook {
  connectWallet: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  step: OnboardingSteps;
  isConnected: boolean;
  errors: Record<string, Error | undefined>;
  clearError: (errorName: string) => void;
  disconnectWallet: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingHook | undefined>(undefined);

export function OnboardingContainer({ children }: { children: ReactElement }) {
  const { chain } = useNetwork();
  const { chains, switchNetworkAsync } = useSwitchNetwork();
  const [step, setOnboardingStep] = useState<OnboardingSteps>('start');
  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const [errors, setErrors] = useState<Record<string, Error | undefined>>({});
  const [isWalletSelectModalOpen, setWalletSelectModalOpen] = useState(false);

  const handleConnectWallet = useCallback(async () => {
    setWalletSelectModalOpen(true);
  }, []);

  const handleDisconnectWallet = useCallback(async () => {
    await disconnectAsync();
    setOnboardingStep('start');
  }, [disconnectAsync]);

  const handleNetworkSwitch = useCallback(async () => {
    const supportedChain = chains[0];

    if (switchNetworkAsync) {
      try {
        await switchNetworkAsync(supportedChain.id);
        setOnboardingStep('finish');
      } catch (error: any) {
        setErrors({ ...errors, switchNetworkError: error as Error });
      }
    }
  }, [chains, errors, switchNetworkAsync]);

  const clearError = useCallback(
    (errorName: string) => {
      setErrors({ ...errors, [errorName]: undefined });
    },
    [errors],
  );

  useEffect(() => {
    if (address !== undefined) {
      if (chain?.unsupported) {
        setOnboardingStep('switch-network');
      } else {
        setOnboardingStep('finish');
      }
    }
  }, [address, chain?.unsupported]);

  const memoizedHook = useMemo<OnboardingHook>(() => {
    return {
      connectWallet: handleConnectWallet,
      switchNetwork: handleNetworkSwitch,
      step,
      isConnected,
      errors,
      clearError,
      disconnectWallet: handleDisconnectWallet,
    };
  }, [
    handleConnectWallet,
    handleNetworkSwitch,
    step,
    isConnected,
    errors,
    clearError,
    handleDisconnectWallet,
  ]);

  return (
    <OnboardingContext.Provider value={memoizedHook}>
      {children}

      <SelectWalletModal
        isOpen={isWalletSelectModalOpen}
        onClose={() => {
          return setWalletSelectModalOpen(false);
        }}
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
