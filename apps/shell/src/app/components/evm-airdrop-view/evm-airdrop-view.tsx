import { IParticipant, useAirdropActions } from '@haqq/shared';
import { Tooltip, formatEthDecimal } from '@haqq/shell-ui-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NX_AIRDROP_ENDPOINT } from '../../constants';
import { ApproveBtn } from '../approve-btn/approve-btn';
import { Hex } from 'viem';

interface IProps {
  address?: string;
}

const PARTICIPANTS_CHECK_INTERVAL = 5000;

const YesCheckbox = ({ value }: { value?: boolean }) => {
  if (!value) {
    return (
      <div className="mr-[4px] flex flex-row items-center ">
        <div className="flex flex-row items-center ">
          <div className="mb-[-2px] ml-[4px] mr-[8px] h-2 w-2 rounded-full bg-[#FF5454] lg:mb-[-3px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mr-[4px] mt-[2px] flex flex-row items-center ">
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
};

const ValueBlock = ({
  text,
  isActive,
  percent,
  tooltip,
}: {
  text: string;
  isActive?: boolean;
  percent?: string;
  tooltip?: string;
}) => {
  const content = (
    <div className="flex items-center">
      <div className="font-clash w-[220px] text-[14px] font-[500]  uppercase text-white/50 md:text-[12px]">
        {text}
      </div>
      <div className="ml-[12px] flex items-center font-sans text-[18px]  font-[500] text-white">
        <YesCheckbox value={isActive} />
        {percent && <div>{percent} %</div>}
      </div>
    </div>
  );
  if (!tooltip) {
    return content;
  }
  return (
    <Tooltip text={tooltip}>
      <div className="cursor-pointer">{content}</div>
    </Tooltip>
  );
};

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

export const EvmAirdropView = ({ address }: IProps) => {
  const { participant } = useAirdropChecker(address);

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

  const hasAirdrop = (participant?.amount || 0) > 0;

  return (
    <div className="flex">
      <div className="flex w-full flex-col items-start gap-[20px]">
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
          text="Staked more than 50% of your ISLMs"
          isActive={participant?.is_staked_many}
          percent="15.00"
          tooltip="You have staked most of your balance"
        />

        <div className=" border-haqq-border mt-[16px] border-b border-t border-dashed pb-[12px] pt-[12px]">
          <ValueBlock
            text="EXTRA: RUN Validator"
            isActive={participant?.is_validator}
          />
        </div>

        {hasAirdrop ? (
          <>
            <div className="mt-[20px]">
              <div className="font-clash w-[220px] text-[14px] font-[500]  uppercase text-white/50 md:text-[12px]">
                Your Amount airdrop
              </div>
              <div className="mt-[5px] font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
                {formatEthDecimal(participant?.amount || 0, 2)} ISLMs
              </div>
            </div>

            <div className="mt-[23px]">
              <ApproveBtn
                participationAddress={address}
                message={MESSAGE}
                participant={participant}
                isCosmos={false}
                onSign={onSignHandler}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
