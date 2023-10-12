import { useCallback } from 'react';
import { Address } from '../address/address';
import { ApproveBtn } from '../approve-btn/approve-btn';
import {
  AirdropResultStrongText,
  useAirdropChecker,
} from '../evm-airdrop-view/evm-airdrop-view';
import { Keplr } from '@keplr-wallet/types';
import { formatEthDecimal } from '@haqq/shared';
import {
  AirdropChallenge,
  AirdropChallengeStatusFailed,
  AirdropChallengeStatusSuccess,
} from '../airdrop-challenge/airdrop-challenge';

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
  participationAddress,
  ethAddressFromKeplr,
  icon,
  chainId,
  airdropEndpoint,
}: {
  participationAddress?: string;
  icon: string;
  chainId: string;
  ethAddressFromKeplr: string;
  airdropEndpoint?: string;
}) {
  const { participant } = useAirdropChecker(
    participationAddress,
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

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="h-[48px]">
        <img
          src={icon}
          alt="icon"
          className="h-auto max-h-full w-auto max-w-[200px]"
        />
      </div>

      {participationAddress && (
        <div>
          <div className="font-guise text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            Address
          </div>
          <div className="font-guise text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <Address address={participationAddress} />
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
              participationAddress={participationAddress}
              message={MSG}
              participant={participant}
              isCosmos
              onSign={keplrSignArbitrary}
              ethAddress={ethAddressFromKeplr}
              airdropEndpoint={airdropEndpoint}
            />
          </div>
        </>
      )}
    </div>
  );
}
