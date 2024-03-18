import { useCallback } from 'react';
import { useWallet } from '../../providers/wallet-provider';

export function useNetworkAwareAction() {
  const { isNetworkSupported, openSelectChain } = useWallet();

  const executeIfNetworkSupported = useCallback(
    (callback: () => void) => {
      if (isNetworkSupported) {
        callback();
      } else {
        console.warn('Network not supported');
        openSelectChain();
      }
    },
    [isNetworkSupported, openSelectChain],
  );

  return { executeIfNetworkSupported };
}
