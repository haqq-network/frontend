import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Hex } from 'viem';
import {
  IParticipant,
  ethToHaqq,
  formatEthDecimal,
  useAirdropActions,
} from '@haqq/shell-shared';
import {
  AirdropChallenge,
  AirdropChallengeStatusFailed,
  AirdropChallengeStatusSuccess,
} from '../airdrop-challenge/airdrop-challenge';
import { ApproveBtn } from '../approve-btn/approve-btn';

export const PARTICIPANTS_CHECK_INTERVAL = 20000;

export function AirdropResultStrongText({ children }: PropsWithChildren) {
  return (
    <div className="font-clash mb-[-2px] text-[14px] leading-[18px] text-white md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
      {children}
    </div>
  );
}

function useAirdropCheckerEvm(
  participationAddressEvm: string | undefined,
  airdropEndpoint?: string,
) {
  const { checkAirdropEvm: checkAirdrop } = useAirdropActions();

  const [participant, setParticipant] = useState<IParticipant | undefined>();

  const loadAirdrop = useCallback(() => {
    participationAddressEvm &&
      airdropEndpoint &&
      checkAirdrop(airdropEndpoint, participationAddressEvm).then((p) => {
        setParticipant(p);
      });
  }, [participationAddressEvm, airdropEndpoint, checkAirdrop]);

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

const EMV_SIGN_MESSAGE = 'Haqqdrop!';

export function EvmAirdropView({
  address,
  airdropEndpoint,
  isCosmos,
}: {
  address: string;
  airdropEndpoint?: string;
  isCosmos?: boolean;
}) {
  const { participant } = useAirdropCheckerEvm(address, airdropEndpoint);

  const { signEvm, signKeplr } = useAirdropActions();

  const onSignHandler = useCallback(async () => {
    if (!address) {
      return {
        signature: '',
      };
    }

    if (isCosmos) {
      return await signKeplr('haqq_11235-1', ethToHaqq(address));
    } else {
      const signature = await signEvm(address as Hex, EMV_SIGN_MESSAGE);

      return {
        signature,
      };
    }
  }, [address, signEvm, signKeplr, isCosmos]);

  const hasAirdrop = (participant?.amount || 0) > 0;

  const { participateEvm, participateCosmos } = useAirdropActions();

  const onParticipate = useCallback(
    (signature: string) => {
      return isCosmos
        ? participateCosmos(
            airdropEndpoint,
            ethToHaqq(address),
            signature,
            ethToHaqq(address || ''),
          )
        : participateEvm(airdropEndpoint, EMV_SIGN_MESSAGE, signature);
    },
    [participateEvm, airdropEndpoint, address, participateCosmos, isCosmos],
  );

  return (
    <div className="flex flex-col gap-[20px]">
      <CommunityAirdropNote />

      <div className="divide-haqq-border flex w-full flex-col divide-y divide-dashed">
        <AirdropChallenge
          label="Activated the wallet on the network"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {participant?.is_activated_wallet_on_network ? (
                <AirdropChallengeStatusSuccess />
              ) : (
                <AirdropChallengeStatusFailed />
              )}
              <AirdropResultStrongText>10.00 %</AirdropResultStrongText>
            </div>
          }
          tooltip="This means that your balance on the network is greater than 0, you could receive GasDrop or one of several GiveAway, or Ambassadors rewards"
        />
        <AirdropChallenge
          label="Staked"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {participant?.is_has_staking ? (
                <AirdropChallengeStatusSuccess />
              ) : (
                <AirdropChallengeStatusFailed />
              )}
              <AirdropResultStrongText>25.00 %</AirdropResultStrongText>
            </div>
          }
          tooltip="You have staked any amount of ISLM on mainnet"
        />

        <AirdropChallenge
          label="Voted"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {participant?.is_has_votes ? (
                <AirdropChallengeStatusSuccess />
              ) : (
                <AirdropChallengeStatusFailed />
              )}
              <AirdropResultStrongText>15.00 %</AirdropResultStrongText>
            </div>
          }
          tooltip="You have voted on mainnet gov"
        />
        <AirdropChallenge
          label="Voted several times"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {participant?.is_voted_several_times ? (
                <AirdropChallengeStatusSuccess />
              ) : (
                <AirdropChallengeStatusFailed />
              )}
              <AirdropResultStrongText>15.00 %</AirdropResultStrongText>
            </div>
          }
          tooltip="You have voted several times on mainnet gov"
        />
        <AirdropChallenge
          label="Staked more than 50% of your ISLM"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {participant?.is_staked_many ? (
                <AirdropChallengeStatusSuccess />
              ) : (
                <AirdropChallengeStatusFailed />
              )}
              <AirdropResultStrongText>15.00 %</AirdropResultStrongText>
            </div>
          }
          tooltip="You have staked most of your balance"
        />
        <AirdropChallenge
          label="Extra: Run validator"
          result={
            <div className="flex flex-row items-center gap-[6px]">
              {participant?.is_validator ? (
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
          <div className="flex flex-col gap-y-[6px]">
            <div>
              <span className="font-guise text-[10px] font-[600] uppercase leading-[14px] text-white/50 lg:text-[12px]">
                Your airdrop amount
              </span>
            </div>
            <span className="font-clash text-[24px] uppercase leading-[30px] text-white">
              {formatEthDecimal(BigInt(participant?.amount ?? 0), 2)} ISLM
            </span>
          </div>

          <ApproveBtn
            participationAddress={address}
            participant={participant}
            isCosmos={isCosmos}
            onSign={onSignHandler}
            onParticipate={onParticipate}
          />
        </>
      )}
    </div>
  );
}

function AirdropBlockTitle({ children }: PropsWithChildren) {
  return (
    <span className="font-guise text-[10px] font-[600] uppercase leading-[14px] text-white/50 lg:text-[12px]">
      {children}
    </span>
  );
}

function AirdropBlockWithTitle({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-col gap-y-[6px]">
      <div>
        <AirdropBlockTitle>{title}</AirdropBlockTitle>
      </div>
      <div>{children}</div>
    </div>
  );
}
function CommunityAirdropNote() {
  return (
    <AirdropBlockWithTitle title="Notes">
      <div className="font-guise text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]">
        Only participants of #TheHaqqExpedition (holders of the Pioneer role)
        community program & HAQQ Network active participants, current Islamic
        Coin Ambassadors, alongside HAQQ Network Validators, are eligible.
      </div>
    </AirdropBlockWithTitle>
  );
}
