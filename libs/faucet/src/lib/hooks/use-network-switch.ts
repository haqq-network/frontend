import { useCallback } from 'react';
import { useChains, useSwitchChain } from 'wagmi';

export function useNetworkSwitch() {
  const chains = useChains();
  const { switchChainAsync } = useSwitchChain();

  const handleNetworkSwitch = useCallback(async () => {
    if (switchChainAsync) {
      try {
        await switchChainAsync({ chainId: chains[0].id });
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  }, [chains, switchChainAsync]);

  return { handleNetworkSwitch };
}
