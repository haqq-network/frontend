import { useCallback } from 'react';
import { Hex } from 'viem';
import { useWalletClient } from 'wagmi';

interface QrRegistrationActionsHook {
  sign: (account: Hex, message: string) => Promise<string>;
}

export function useQrRegistrationActions(): QrRegistrationActionsHook {
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

  return {
    sign: handlePersonalSign,
  };
}
