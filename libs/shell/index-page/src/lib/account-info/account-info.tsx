import { useCallback, useMemo, useState } from 'react';
import { useBalance } from 'wagmi';
import {
  useAddress,
  useClipboard,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
} from '@haqq/shared';
import { CopyIcon, Card, CardHeading } from '@haqq/shell-ui-kit';

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
      <Card className="flex min-h-[350px] flex-1 flex-col items-start justify-between space-y-4">
        <div className="flex w-full flex-1 items-center">
          <div className="w-full flex-auto text-center">
            You should connect wallet first
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex min-h-[350px] flex-1 flex-col items-start justify-between space-y-4">
      {ethAddress && haqqAddress && (
        <div className="max-w-full">
          <CardHeading>Address</CardHeading>

          <div className="mb-2">
            {/* <Tooltip text={isEthAddressCopy ? 'Copied' : 'Click to copy'}> */}
            <div
              className="group flex cursor-pointer flex-row items-center justify-center space-x-[8px]"
              onClick={handleEthAddressCopy}
            >
              <div className="w-full overflow-hidden text-ellipsis text-[18px] leading-[22px]">
                {ethAddress}
              </div>
              <div>
                <CopyIcon className="text-white/20 transition-colors duration-100 ease-in-out group-hover:text-gray-400" />
              </div>
            </div>
            {/* </Tooltip> */}
          </div>
          <div>
            {/* <Tooltip text={isHaqqAddressCopy ? 'Copied' : 'Click to copy'}> */}
            <div
              className="group flex cursor-pointer flex-row items-center justify-center space-x-[8px]"
              onClick={handleHaqqAddressCopy}
            >
              <div className="w-full overflow-hidden text-ellipsis text-[18px] leading-[22px]">
                {haqqAddress}
              </div>
              <div>
                <CopyIcon className="text-white/20 transition-colors duration-100 ease-in-out group-hover:text-gray-400" />
              </div>
            </div>
            {/* </Tooltip> */}
          </div>
        </div>
      )}

      {balance && (
        <div>
          <CardHeading>Balance</CardHeading>
          <div className="mb-[-10px] font-serif text-[42px] font-[500] leading-[1.25]">
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
