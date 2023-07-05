import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
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
  const { connectAsync, connectors, isLoading, pendingConnector } =
    useConnect();

  const handleSelectWalletModalOpen = useCallback(async () => {
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
      connectWallet: handleSelectWalletModalOpen,
      switchNetwork: handleNetworkSwitch,
      step,
      isConnected,
      errors,
      clearError,
      disconnectWallet: handleDisconnectWallet,
    };
  }, [
    handleSelectWalletModalOpen,
    handleNetworkSwitch,
    step,
    isConnected,
    errors,
    clearError,
    handleDisconnectWallet,
  ]);

  const handleWalletConnect = useCallback(
    async (connectorIdx: number) => {
      try {
        await connectAsync({ connector: connectors[connectorIdx] });
        setWalletSelectModalOpen(false);
      } catch (error) {
        setErrors({ ...errors, connectionError: error as Error });
      }
    },
    [connectAsync, connectors, errors],
  );

  const selectWalletModalConnectors = useMemo(() => {
    return connectors.map((connector, index) => {
      return {
        id: index,
        name: connector.name,
        isPending: isLoading && pendingConnector?.id === connector.id,
      };
    });
  }, [connectors, isLoading, pendingConnector?.id]);

  return (
    <OnboardingContext.Provider value={memoizedHook}>
      {children}

      <SelectWalletModal
        isOpen={isWalletSelectModalOpen}
        connectors={selectWalletModalConnectors}
        error={errors['connectionError']?.message}
        onConnectClick={handleWalletConnect}
        onClose={() => {
          setWalletSelectModalOpen(false);
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
