import { useCallback, useMemo } from 'react';
import { TxGenerated } from '@evmos/transactions';
import { useAddress } from '../use-address/use-address';
import { getChainParams } from '../../chains/get-chain-params';
import { mapToCosmosChain } from '../../chains/map-to-cosmos-chain';
import { useNetwork, useWalletClient } from 'wagmi';

interface QrRegistrationActionsHook {
  sign: (message: string) => Promise<string>;
}

export function useQrRegistrationActions(): QrRegistrationActionsHook {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { ethAddress } = useAddress();

  const haqqChain = useMemo(() => {
    if (!chain || chain.unsupported) {
      return undefined;
    }

    const chainParams = getChainParams(chain.id);
    return mapToCosmosChain(chainParams);
  }, [chain]);

  const signTransaction = useCallback(
    async (message: string) => {
      if (haqqChain && ethAddress && walletClient) {
        const signature = await walletClient.signMessage({
          account: ethAddress,
          message,
        });

        return signature;
      } else {
        throw new Error('No haqqChain');
      }
    },
    [ethAddress, haqqChain, walletClient],
  );

  return {
    sign: signTransaction,
  };
}
