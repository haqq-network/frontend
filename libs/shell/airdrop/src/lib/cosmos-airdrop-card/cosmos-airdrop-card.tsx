import { useCallback, useEffect, useRef, useState } from 'react';
import { Address } from '../address/address';
import { ApproveBtn } from '../approve-btn/approve-btn';
import {
  AirdropResultStrongText,
  PARTICIPANTS_CHECK_INTERVAL,
} from '../evm-airdrop-view/evm-airdrop-view';
import { Keplr } from '@keplr-wallet/types';
import {
  IParticipant,
  formatEthDecimal,
  useAirdropActions,
} from '@haqq/shared';
import {
  AirdropChallenge,
  AirdropChallengeStatusFailed,
  AirdropChallengeStatusSuccess,
} from '../airdrop-challenge/airdrop-challenge';

function useAirdropCheckerCosmos(
  participationAddressCosmos: string | undefined,
  participationAddressEvmos: string | undefined,
  airdropEndpoint?: string,
) {
  const { checkAirdropCosmos: checkAirdrop } = useAirdropActions();

  const [participant, setParticipant] = useState<IParticipant | undefined>();

  const loadAirdrop = useCallback(() => {
    participationAddressCosmos &&
      participationAddressEvmos &&
      airdropEndpoint &&
      checkAirdrop(
        airdropEndpoint,
        participationAddressCosmos,
        participationAddressEvmos,
      ).then((p) => {
        setParticipant(p);
      });
  }, [
    participationAddressEvmos,
    participationAddressCosmos,
    airdropEndpoint,
    checkAirdrop,
  ]);

  const intervalRef = useRef<number>();

  useEffect(() => {
    loadAirdrop();

    const intervalId = setInterval(
      loadAirdrop,
      PARTICIPANTS_CHECK_INTERVAL,
    ) as unknown;
    intervalRef.current = intervalId as number;

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [loadAirdrop]);

  return { participant };
}

export const getKeplrWallet = async (): Promise<Keplr | undefined> => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        console.log('getKeplrWallet', {
          version: window?.keplr?.version,
        });
        document.removeEventListener('readystatechange', documentStateChange);
        resolve(window.keplr);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

const MSG = 'Haqqdrop!';

export function CosmosAirdropCard({
  participationAddressCosmos,
  participationAddressEvmos,
  isEvmos,
  icon,
  chainId,
  airdropEndpoint,
}: {
  participationAddressCosmos?: string;
  participationAddressEvmos?: string;
  icon: string;
  chainId: string;
  isEvmos: boolean;
  airdropEndpoint?: string;
}) {
  const { participant } = useAirdropCheckerCosmos(
    participationAddressCosmos,
    participationAddressEvmos,
    airdropEndpoint,
  );

  const keplrSignArbitrary = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();
    if (keplrWallet) {
      const { bech32Address } = await keplrWallet.getKey(chainId);

      const signatureArb = await keplrWallet?.signArbitrary(
        chainId,
        bech32Address,
        MSG,
      );

      return {
        signature: signatureArb.signature,
        pubKey: signatureArb.pub_key.value,
      };
    } else {
      return {
        signature: '',
      };
    }
  }, [chainId]);

  const hasAirdrop = (participant?.amount || 0) > 0;

  const address = isEvmos
    ? participationAddressEvmos
    : participationAddressCosmos;

  const { participateCosmos } = useAirdropActions();

  const onParticipate = useCallback(
    (signature: string) => {
      return participateCosmos(airdropEndpoint, MSG, signature, address);
    },
    [participateCosmos, airdropEndpoint, address],
  );

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="h-[48px]">
        <img
          src={icon}
          alt="icon"
          className="h-auto max-h-full w-auto max-w-[200px]"
        />
      </div>

      {address && (
        <div>
          <div className="font-guise text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            Address
          </div>
          <div className="font-guise text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <Address address={address} />
          </div>
        </div>
      )}

      <div className="divide-haqq-border flex w-full flex-col divide-y divide-dashed">
        <AirdropChallenge
          label="It is possible to get an airdrop"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {(participant?.amount || 0) > 0 ? (
                <>
                  <AirdropChallengeStatusSuccess />
                  <AirdropResultStrongText>Yes</AirdropResultStrongText>
                </>
              ) : (
                <AirdropChallengeStatusFailed />
              )}
            </div>
          }
        />
      </div>

      {hasAirdrop && (
        <>
          <div>
            <div className="font-guise text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              Amount airdrop
            </div>
            <div className="font-guise text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
              {formatEthDecimal(BigInt(participant?.amount ?? 0), 2)} ISLM
            </div>
          </div>

          <div className="mt-[4px]">
            <ApproveBtn
              participationAddress={address}
              participant={participant}
              isCosmos={true}
              onSign={keplrSignArbitrary}
              onParticipate={onParticipate}
            />
          </div>
        </>
      )}
    </div>
  );
}
