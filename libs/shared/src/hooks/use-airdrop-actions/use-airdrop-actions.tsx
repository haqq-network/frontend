import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { Hex } from 'viem';
import axios from 'axios';

interface AirdropActionsHook {
  sign: (account: Hex, message: string) => Promise<string>;
  checkAirdrop: (host: string, address: string) => Promise<IParticipant>;
  participate: (
    host: string,
    message: string,
    signature: string,
  ) => Promise<IParticipateResult>;
}

export interface IParticipateResult {
  message: string;
  status: string;
}

export interface IParticipant {
  id: string;
  is_supporter: boolean;
  is_has_transactions: boolean;
  is_has_staking: boolean;
  is_has_votes: boolean;
  is_validator: boolean;
  amount: number;
}

export function useAirdropActions(): AirdropActionsHook {
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

  const checkAirdrop = useCallback(async (host: string, address: string) => {
    const result = await axios.get<IParticipant>(
      `${host}/api/participant/${address}`,
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    return result.data;
  }, []);

  const participate = useCallback(
    async (host: string, message: string, signature: string) => {
      try {
        const result = await axios.post<IParticipateResult>(
          `${host}/api/participate`,
          {
            message,
            signature,
          },
          {
            headers: {
              'content-type': 'application/json',
            },
          },
        );

        return result.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        return e?.response?.data;
      }
    },
    [],
  );

  return {
    sign: handlePersonalSign,
    checkAirdrop,
    participate,
  };
}
