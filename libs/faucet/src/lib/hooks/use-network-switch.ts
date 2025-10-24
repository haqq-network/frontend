import { useCallback } from 'react';
import { useSwitchChain } from 'wagmi';

export function useNetworkSwitch() {
  const { switchChainAsync } = useSwitchChain();

  const handleNetworkSwitch = useCallback(
    async (chainId: number) => {
      if (switchChainAsync) {
        try {
          await switchChainAsync({ chainId });
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    },
    [switchChainAsync],
  );

  return { handleNetworkSwitch };
}
