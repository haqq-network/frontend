import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { Hex } from 'viem';
import axios from 'axios';

export interface IParticipateResult {
  message: string;
  status: string;
  address: string;
}

export enum ParticipantStatus {
  Awaiting = 'awaiting',
  Checking = 'checking',
  Failed = 'failed',
  Queued = 'queued',
  Redeemed = 'redeemed',
  Unknown = 'unknown',
}

export interface IParticipant {
  id: string;
  created_at: number;
  is_has_staking: boolean;
  is_has_votes: boolean;
  is_validator: boolean;
  is_activated_wallet_on_network: boolean;
  is_voted_several_times: boolean;
  is_staked_many: boolean;
  to_address: string;
  amount: number;
  status: ParticipantStatus;
  tx_hash: string;
  updated_at: number;
  airdrop_type: string;
}

export function useAirdropActions() {
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

  const participateEvm = useCallback(
    async (host: string | undefined, message: string, signature: string) => {
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

  const participateCosmos = useCallback(
    async (
      host: string | undefined,
      message: string,
      signature: string,
      address?: string,
      public_key?: string,
    ) => {
      try {
        const result = await axios.post<IParticipateResult>(
          `${host}/api/participate/${address}`,
          {
            message,
            signature,
            public_key,
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
    participateEvm,
    participateCosmos,
  };
}
