import { useCallback } from 'react';
import { Address } from '../address/address';
import { ApproveBtn } from '../approve-btn/approve-btn';
import { AirdropResultStrongText } from '../evm-airdrop-view/evm-airdrop-view';
import {
  IParticipant,
  formatEthDecimal,
  getKeplrWallet,
  useAirdropActions,
} from '@haqq/shared';
import {
  AirdropChallenge,
  AirdropChallengeStatusFailed,
  AirdropChallengeStatusSuccess,
} from '../airdrop-challenge/airdrop-challenge';

const MSG = 'Haqqdrop!';

export function CosmosAirdropCard({
  address,
  icon,
  chainId,
  airdropEndpoint,
  participant,
}: {
  address?: string;
  icon: string;
  chainId: string;
  airdropEndpoint?: string;
  participant?: IParticipant;
}) {
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
                <>
                  <AirdropChallengeStatusFailed />
                  <AirdropResultStrongText>No</AirdropResultStrongText>
                </>
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
