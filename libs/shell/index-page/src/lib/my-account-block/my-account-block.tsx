import {
  useAddress,
  useClipboard,
  useMetamask,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useWindowWidth,
  getFormattedAddress,
} from '@haqq/shared';
import { Text, Tooltip, CopyIcon } from '@haqq/shell/ui-kit';
import { Button } from '@haqq/website/ui-kit';
import { useCallback, useMemo, useState } from 'react';
import { useBalance } from 'wagmi';
import { Heading } from '@haqq/ui-kit';

export function MyAccountBlock() {
  const [isEthAddressCopy, setEthAddressCopy] = useState<boolean>(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState<boolean>(false);
  const { copyText } = useClipboard();
  const { ethAddress, haqqAddress } = useAddress();
  const { connect } = useMetamask();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const { width } = useWindowWidth();
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

  const grayTextClassName = 'text-[12px] leading-[1.2em] uppercase';

  const formattedAddress = (address: string | undefined, width: number) => {
    while (address && width >= 1024) {
      return getFormattedAddress(address);
    }
    return address;
  };

  return (
    <section className="w-full border-y border-dashed border-y-[#ffffff26] px-4 py-8 sm:py-8 sm:px-16 lg:py-8 lg:px-20">
      {!ethAddress ? (
        <div className="flex flex-col items-center space-y-3 py-[62px]">
          <div className="font-sans">You should connect wallet first</div>
          <Button
            onClick={connect}
            variant={2}
            className="!font-serif text-black hover:text-white hover:bg-transparent"
          >
            Connect wallet
          </Button>
        </div>
      ) : (
        <div className="flex flex-col font-sans">
          <div className="mb-[24px] flex flex-row items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V4.6C18 4.82091 18.1791 5 18.4 5H21C21.5523 5 22 5.44772 22 6V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V6V5V3ZM15.6 4C15.8209 4 16 4.17909 16 4.4V4.6C16 4.82091 15.8209 5 15.6 5H4.4C4.17909 5 4 4.82091 4 4.6V4.4C4 4.17909 4.17909 4 4.4 4H15.6ZM4.4 7C4.17909 7 4 7.17909 4 7.4V19.6C4 19.8209 4.17909 20 4.4 20H19.6C19.8209 20 20 19.8209 20 19.6V17.4C20 17.1791 19.8209 17 19.6 17H15C14.4477 17 14 16.5523 14 16V12C14 11.4477 14.4477 11 15 11H19.6C19.8209 11 20 10.8209 20 10.6V7.4C20 7.17909 19.8209 7 19.6 7H4.4ZM20 13.4C20 13.1791 19.8209 13 19.6 13H16.4C16.1791 13 16 13.1791 16 13.4V14.6C16 14.8209 16.1791 15 16.4 15H19.6C19.8209 15 20 14.8209 20 14.6V13.4Z"
                fill="white"
              />
            </svg>
            <Heading level={3} className="ml-[8px]">
              My account
            </Heading>
            <div className="text-[#EC5728] text-[12px] leading-[1.2em] uppercase font-serif font-[600] ml-[16px]">
              Go to staking
            </div>
          </div>

          <div className="flex flex-col space-y-6 lg:flex-row lg:flex-wrap lg:justify-between lg:space-y-0 lg:gap-6">
            <div className="flex flex-col items-start">
              <div className="mb-[6px]">
                <Text className={grayTextClassName}>My balance</Text>
              </div>
              <Text
                className="font-serif text-[16px] leading-[1.25em] text-white sm:text-[18px] sm:leading[1.33em] lg:text-[24px] lg:leading-[1.25em]"
                color="white"
              >
                {balance?.value.toLocaleString()} ISLM
              </Text>
            </div>

            <div className="flex flex-col items-start">
              <div className="mb-[6px]">
                <Text className={grayTextClassName}>Staked</Text>
              </div>
              <Text
                className="text-[16px] leading-[1.25em] text-white sm:text-[18px] sm:leading[1.33em] lg:text-[24px] lg:leading-[1.25em]"
                color="white"
              >
                {delegation.toLocaleString()} ISLM
              </Text>
            </div>

            <div className="flex flex-col items-start">
              <div className="mb-[6px]">
                <Text className={grayTextClassName}>Rewards</Text>
              </div>
              <Text
                className="text-[16px] leading-[1.25em] text-white sm:text-[18px] sm:leading[1.33em] lg:text-[24px] lg:leading-[1.25em]"
                color="white"
              >
                {rewards.toLocaleString()} ISLM
              </Text>
            </div>

            <div className="flex flex-col items-start">
              <div className="mb-[6px]">
                <Text className={grayTextClassName}>Address</Text>
              </div>

              <div className="flex flex-col space-y-2 lg:flex-row items-start font-sans lg:space-y-0 lg:space-x-4">
                <Tooltip
                  text={isEthAddressCopy ? 'Copied' : 'Click to copy'}
                  address={ethAddress}
                  className="font-sans"
                  isCopied={isEthAddressCopy}
                >
                  <div
                    className="cursor-pointer flex flex-row space-x-[8px] items-center justify-center group"
                    onClick={handleEthAddressCopy}
                  >
                    <div className="group-hover:text-gray-400 text-[18px] leading-[28px] text-ellipsis w-full overflow-hidden">
                      {formattedAddress(ethAddress, width)}
                    </div>

                    <CopyIcon className="text-white group-hover:text-gray-400 transition-colors duration-100 ease-in-out" />
                  </div>
                </Tooltip>

                <Tooltip
                  text={isHaqqAddressCopy ? 'Copied' : 'Click to copy'}
                  address={haqqAddress}
                  className="font-sans"
                  isCopied={isHaqqAddressCopy}
                >
                  <div
                    className="cursor-pointer flex flex-row space-x-[8px] items-center justify-center group"
                    onClick={handleHaqqAddressCopy}
                  >
                    <div className="group-hover:text-gray-400 text-[18px] leading-[28px] text-ellipsis w-full overflow-hidden">
                      {formattedAddress(haqqAddress, width)}
                    </div>

                    <CopyIcon className="text-white group-hover:text-gray-400 transition-colors duration-100 ease-in-out" />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
