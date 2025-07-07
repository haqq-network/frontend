import { useCallback } from 'react';
import { useWallet } from '../../providers/wallet-provider';
import { useToast } from '../use-toast/use-toast';

export function useNetworkAwareAction() {
  const { isNetworkSupported, openSelectChain } = useWallet();

  const toast = useToast();

  const executeIfNetworkSupported = useCallback(
    (callback: () => void) => {
      if (isNetworkSupported) {
        callback();
      } else {
        toast.error(
          'Network not supported, please switch to supported network',
        );
        openSelectChain();
      }
    },
    [isNetworkSupported, openSelectChain, toast],
  );

  return { executeIfNetworkSupported };
}
