import { useCallback } from 'react';
import axios from 'axios';
import { getKeplrWallet } from '../use-keplr/use-keplr';
import { usePersonalSign } from '../use-personal-sign/use-personal-sign';
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
  Approved = 'approved',
}

export interface IParticipateResponse {
  message?: string;
  address?: string;
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
  const handlePersonalSign = usePersonalSign();

  const checkAirdropEvm = useCallback(async (host: string, address: string) => {
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

  const checkAirdropCosmos = useCallback(
    async (host: string, addressCosmos: string, addressEvmos: string) => {
      try {
        const result = await axios.post<IParticipateResult>(
          `${host}/api/participant/kepplr`,
          {
            cosmos: addressCosmos,
            evmos: addressEvmos,
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

  const participateEvm = useCallback(
    async (
      host: string | undefined,
      message: string,
      signature: string,
    ): Promise<IParticipateResponse> => {
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
    ): Promise<IParticipateResponse> => {
      try {
        const result = await axios.post<IParticipateResult>(
          `${host}/api/participate/${address}`,
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

  const handleSignKeplr = useCallback(
    async (chainId: string, message: string) => {
      const keplrWallet = await getKeplrWallet();
      if (keplrWallet) {
        const { bech32Address } = await keplrWallet.getKey(chainId);

        const signatureArb = await keplrWallet?.signArbitrary(
          chainId,
          bech32Address,
          message,
        );

        return {
          signature: signatureArb.signature,
        };
      } else {
        return {
          signature: '',
        };
      }
    },
    [],
  );

  return {
    signEvm: handlePersonalSign,
    signKeplr: handleSignKeplr,
    checkAirdropEvm,
    checkAirdropCosmos,
    participateEvm,
    participateCosmos,
  };
}
