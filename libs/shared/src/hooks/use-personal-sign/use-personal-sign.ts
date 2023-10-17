import { useCallback } from 'react';
import { Hex } from 'viem';
import { useWalletClient } from 'wagmi';

export const usePersonalSign = () => {
  const { data: walletClient } = useWalletClient();

  const handlePersonalSign = useCallback(
    async (account: Hex, message: string) => {
      if (walletClient) {
        const signature = await walletClient.signMessage({
          account,
          message,
        });

        return signature;
      } else {
        throw new Error('No walletClient');
      }
    },
    [walletClient],
  );

  return handlePersonalSign;
};
