import { IParticipant, useAirdropActions } from '@haqq/shared';
import { Checkbox, Tooltip, formatEthDecimal } from '@haqq/shell-ui-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NX_AIRDROP_ENDPOINT } from '../../constants';
import { ApproveBtn } from '../approve-btn/approve-btn';
import { Hex } from 'viem';

interface IProps {
  address?: string;
}

const PARTICIPANTS_CHECK_INTERVAL = 5000;

function YesCheckbox({ value }: { value?: boolean }) {
  if (!value) {
    return (
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center ">
          <div className="mb-[-2px] ml-[4px] mr-[8px] h-2 w-2 rounded-full bg-[#FF5454] lg:mb-[-3px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[-1px] flex flex-row items-center">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[#01B26E]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function ValueBlock({
  text,
  isActive,
  percent,
  tooltip,
  available = true,
}: {
  text: string;
  isActive?: boolean;
  percent?: string;
  tooltip?: string;
  available?: boolean;
}) {
  const label = (
    <div className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
      {text}
    </div>
  );

  return (
    <div className="flex flex-1 items-center justify-between gap-[12px]">
      <div className="cursor-default leading-[0]">
        {tooltip ? (
          <Tooltip text={tooltip} className="z-50 inline-flex min-w-[300px]">
            {label}
          </Tooltip>
        ) : (
          label
        )}
      </div>
      {available ? (
        <div className="flex flex-row items-center gap-[6px]">
          <YesCheckbox value={isActive} />
          <div className="font-clash text-[14px] leading-[18px] text-white md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
            {percent && <div>{percent} %</div>}
          </div>
        </div>
      ) : (
        <div className="font-guise text-[11px] leading-[18px] md:text-[16px] md:leading-[26px]">
          Coming October 11
        </div>
      )}
    </div>
  );
}

export const useAirdropChecker = (address?: string) => {
  const { checkAirdrop } = useAirdropActions();

  const [participant, setParticipant] = useState<IParticipant | undefined>();

  const loadAirdrop = useCallback(() => {
    address &&
      NX_AIRDROP_ENDPOINT &&
      checkAirdrop(NX_AIRDROP_ENDPOINT, address).then((p) => {
        setParticipant(p);
      });
  }, [address, checkAirdrop]);

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
};

const MESSAGE = 'Haqqdrop!';

export function EvmAirdropView({ address }: IProps) {
  const { participant } = useAirdropChecker(address);
  const [isNotResident, setImNotResidentDubai] = useState(false);

  const { sign } = useAirdropActions();
  const onSignHandler = useCallback(async () => {
    if (!address) {
      return {
        signature: '',
      };
    }
    const signature = await sign(address as Hex, MESSAGE);

    return {
      signature,
    };
  }, [address, sign]);

  // const hasAirdrop = (participant?.amount || 0) > 0;
  const hasAirdrop = true;

  return (
    <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 2xl:grid-cols-3">
      <div className="flex flex-col gap-[20px]">
        <div className="flex w-full flex-col gap-[8px]">
          <ValueBlock
            text="Activated the wallet on the network"
            isActive={participant?.is_activated_wallet_on_network}
            percent={'10.00'}
            tooltip="This means that your balance on the network is greater than 0, you could receive GasDrop or one of several GiveAway, or Ambassadors rewards"
          />
          <ValueBlock
            text="Staked"
            isActive={participant?.is_has_staking}
            percent="25.00"
            tooltip="You have staked any amount of ISLM on mainnet"
          />
          <ValueBlock
            text="Voted"
            isActive={participant?.is_has_votes}
            percent="15.00"
            tooltip="You have voted on mainnet gov"
          />
          <ValueBlock
            text="Voted several times"
            isActive={participant?.is_voted_several_times}
            percent="15.00"
            tooltip="You have voted several times on mainnet gov"
          />
          <ValueBlock
            text="Staked more than 50% of your ISLM"
            isActive={participant?.is_staked_many}
            percent="15.00"
            tooltip="You have staked most of your balance"
          />
        </div>

        <div className="border-haqq-border mt-[16px] border-y border-dashed py-[12px]">
          <ValueBlock
            text="Extra: Run validator"
            isActive={participant?.is_validator}
            available={false}
          />
        </div>

        {hasAirdrop && (
          <>
            <div className="flex flex-col gap-y-[6px]">
              <span className="font-guise text-[12px] font-[600] uppercase leading-[1.2em] text-white/50 sm:text-[10px] lg:text-[12px]">
                Your Amount Airdrop
              </span>
              <span className="font-clash text-[24px] uppercase leading-[30px] text-white">
                {formatEthDecimal(participant?.amount || 0, 2)} ISLM
              </span>
            </div>

            <div>
              <Checkbox
                value={isNotResident}
                onChange={setImNotResidentDubai}
                className="mr-[8px]"
              >
                I confirm that I am not a resident of Dubai.
              </Checkbox>
            </div>

            <div>
              <ApproveBtn
                participationAddress={address}
                message={MESSAGE}
                participant={participant}
                isCosmos={false}
                onSign={onSignHandler}
                disabled={!isNotResident}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
