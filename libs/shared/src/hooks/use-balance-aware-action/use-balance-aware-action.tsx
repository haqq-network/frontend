import { useCallback } from 'react';
import { useWallet } from '../../providers/wallet-provider';

export function useBalanceAwareActions(balance: number) {
  const { openLowBalanceAlert } = useWallet();

  const executeIfCanPayFee = useCallback(
    (callback: () => void) => {
      if (balance > 0.2) {
        callback();
      } else {
        console.warn('Not enough balance to pay fee');
        openLowBalanceAlert();
      }
    },
    [balance, openLowBalanceAlert],
  );

  return {
    executeIfCanPayFee,
  };
}
