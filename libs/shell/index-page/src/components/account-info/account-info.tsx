import { useCallback, useMemo, useState } from 'react';
import { useBalance } from 'wagmi';
import {
  useAddress,
  useClipboard,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
} from '@haqq/shared';
import { Card, CardHeading, Tooltip } from '@haqq/ui-kit';
import clsx from 'clsx';

export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('h-[20px] w-[20px]', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

export function ShellIndexPageAccountInfo() {
  const [isEthAddressCopy, setEthAddressCopy] = useState(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState(false);
  const { copyText } = useClipboard();
  const { ethAddress, haqqAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);

  const delegation = useMemo(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;

      for (const delegation of delegationInfo.delegation_responses) {
        del = del + Number.parseInt(delegation.balance.amount, 10);
      }

      return del / 10 ** 18;
    }

    return 0;
  }, [delegationInfo]);

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      const totalRewards =
        Number.parseFloat(rewardsInfo.total[0].amount) / 10 ** 18;

      return totalRewards;
    }

    return 0;
  }, [rewardsInfo]);

  const handleEthAddressCopy = useCallback(async () => {
    if (ethAddress) {
      await copyText(ethAddress);
      setHaqqAddressCopy(false);
      setEthAddressCopy(true);
    }
  }, [copyText, ethAddress]);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (haqqAddress) {
      await copyText(haqqAddress);
      setEthAddressCopy(false);
      setHaqqAddressCopy(true);
    }
  }, [copyText, haqqAddress]);

  if (!ethAddress) {
    return (
      <Card className="flex flex-col space-y-4 min-h-[350px] items-start justify-between flex-1">
        <div className="flex flex-1 items-center w-full">
          <div className="w-full flex-auto text-center">
            You should connect wallet first
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col space-y-4 min-h-[350px] items-start justify-between flex-1">
      {ethAddress && haqqAddress && (
        <div className="max-w-full">
          <CardHeading>Address</CardHeading>

          <div className="mb-2">
            {/* <Tooltip text={isEthAddressCopy ? 'Copied' : 'Click to copy'}> */}
            <div
              className="cursor-pointer flex flex-row space-x-[8px] items-center justify-center group"
              onClick={handleEthAddressCopy}
            >
              <div className="text-[18px] leading-[22px] text-ellipsis w-full overflow-hidden">
                {ethAddress}
              </div>
              <div>
                <CopyIcon className="text-white/20 group-hover:text-gray-400 transition-colors duration-100 ease-in-out" />
              </div>
            </div>
            {/* </Tooltip> */}
          </div>
          <div>
            {/* <Tooltip text={isHaqqAddressCopy ? 'Copied' : 'Click to copy'}> */}
            <div
              className="cursor-pointer flex flex-row space-x-[8px] items-center justify-center group"
              onClick={handleHaqqAddressCopy}
            >
              <div className="text-[18px] leading-[22px] text-ellipsis w-full overflow-hidden">
                {haqqAddress}
              </div>
              <div>
                <CopyIcon className="text-white/20 group-hover:text-gray-400 transition-colors duration-100 ease-in-out" />
              </div>
            </div>
            {/* </Tooltip> */}
          </div>
        </div>
      )}

      {balance && (
        <div>
          <CardHeading>Balance</CardHeading>
          <div className="font-serif font-[500] text-[42px] leading-[1.25] mb-[-10px]">
            {balance.value.toLocaleString()} ISLM
          </div>
        </div>
      )}

      <div>
        <CardHeading>Staked</CardHeading>
        <div className="text-2xl font-semibold leading-normal">
          {delegation.toLocaleString()} <span className="text-base">ISLM</span>
        </div>
      </div>

      <div>
        <CardHeading>Unclaimed rewards</CardHeading>
        <div className="text-2xl font-semibold leading-normal">
          {rewards.toLocaleString()} <span className="text-base">ISLM</span>
        </div>
      </div>
    </Card>
  );
}
