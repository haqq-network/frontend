import {
  useAddress,
  useClipboard,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useWindowWidth,
  getFormattedAddress,
  useWallet,
} from '@haqq/shared';
import { Button, Heading } from '@haqq/website/ui-kit';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useBalance } from 'wagmi';
import { OrangeLink, CopyIcon, Container } from '@haqq/shell/ui-kit';
import clsx from 'clsx';

function MyAccountAmountBlock({
  title,
  value,
  isGreen = false,
  valueClassName,
}: {
  title: string;
  value: string | ReactNode;
  isGreen?: boolean;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="mb-[6px] text-[12px] font-[500] uppercase leading-[1.2em] text-white/50">
        {title}
      </div>
      <div
        className={clsx(
          'font-[500]',
          isGreen
            ? 'font-serif text-[20px] leading-[26px] text-[#01B26E]'
            : 'font-sans text-[18px] leading-[28px] text-white',
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function MyAccountBlock() {
  const [isEthAddressCopy, setEthAddressCopy] = useState<boolean>(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState<boolean>(false);
  const { copyText } = useClipboard();
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet } = useWallet();
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
      value: Number.parseFloat(balanceData.formatted).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      }),
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

  const formattedAddress = (address: string | undefined, width: number) => {
    while (address && width >= 1024) {
      return getFormattedAddress(address);
    }
    return address;
  };

  return !ethAddress ? (
    <div className="flex flex-col items-center space-y-[12px] border-y border-dashed border-[#ffffff26] py-[58px]">
      <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
        You should connect wallet first
      </div>
      <Button
        onClick={openSelectWallet}
        variant={2}
        className="text-black hover:bg-transparent hover:text-white"
      >
        Connect wallet
      </Button>
    </div>
  ) : (
    <Container className="border-y border-dashed border-y-[#ffffff26]">
      <div className="flex flex-col py-[32px] font-sans sm:py-[22px] lg:py-[32px]">
        <div className="mb-[24px] flex flex-row items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V4.6C18 4.82091 18.1791 5 18.4 5H21C21.5523 5 22 5.44772 22 6V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V6V5V3ZM15.6 4C15.8209 4 16 4.17909 16 4.4V4.6C16 4.82091 15.8209 5 15.6 5H4.4C4.17909 5 4 4.82091 4 4.6V4.4C4 4.17909 4.17909 4 4.4 4H15.6ZM4.4 7C4.17909 7 4 7.17909 4 7.4V19.6C4 19.8209 4.17909 20 4.4 20H19.6C19.8209 20 20 19.8209 20 19.6V17.4C20 17.1791 19.8209 17 19.6 17H15C14.4477 17 14 16.5523 14 16V12C14 11.4477 14.4477 11 15 11H19.6C19.8209 11 20 10.8209 20 10.6V7.4C20 7.17909 19.8209 7 19.6 7H4.4ZM20 13.4C20 13.1791 19.8209 13 19.6 13H16.4C16.1791 13 16 13.1791 16 13.4V14.6C16 14.8209 16.1791 15 16.4 15H19.6C19.8209 15 20 14.8209 20 14.6V13.4Z"
              fill="currentColor"
            />
          </svg>
          <Heading level={3} className="ml-[8px]">
            My account
          </Heading>
          <OrangeLink
            href="/staking"
            className="ml-[16px] font-serif !text-[12px] uppercase"
          >
            Go to Staking
          </OrangeLink>
        </div>

        <div className="flex flex-col space-y-6 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-6 lg:space-y-0">
          <MyAccountAmountBlock
            title="Balance"
            value={`${balance?.value} ISLM`}
            valueClassName="!text-white"
            isGreen
          />
          <MyAccountAmountBlock
            title="Staked"
            value={`${delegation.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 3,
            })} ISLM`}
          />
          <MyAccountAmountBlock
            title="Rewards"
            value={`${rewards.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 3,
            })} ISLM`}
          />
          <MyAccountAmountBlock
            title="Address"
            value={
              <div className="flex flex-col items-start space-y-2 font-sans lg:flex-row lg:space-x-4 lg:space-y-0">
                <div
                  className="group flex cursor-pointer flex-row items-center justify-center space-x-[8px] text-white transition-colors duration-100 ease-in-out hover:text-gray-400"
                  onClick={handleEthAddressCopy}
                >
                  <div className="text-[18px] leading-[28px]">
                    {formattedAddress(ethAddress, width)}
                  </div>

                  <CopyIcon className="mb-[-3px]" />
                </div>
                <div
                  className="group flex cursor-pointer flex-row items-center justify-center space-x-[8px] text-white transition-colors duration-100 ease-in-out hover:text-gray-400"
                  onClick={handleHaqqAddressCopy}
                >
                  <div className="text-[18px] leading-[28px]">
                    {formattedAddress(haqqAddress, width)}
                  </div>

                  <CopyIcon className="mb-[-3px]" />
                </div>
              </div>
            }
          />

          {/* <div className="flex flex-col items-start">
            <div className="mb-[6px]">
              <div className={grayTextClassName}>My balance</div>
            </div>
            <div className="sm:leading[1.33em] font-serif text-[16px] leading-[1.25em] text-white sm:text-[18px] lg:text-[24px] lg:leading-[1.25em]">
              {balance?.value.toLocaleString()} ISLM
            </div>
          </div> */}

          {/* <div className="flex flex-col items-start">
            <div className="mb-[6px]">
              <div className={grayTextClassName}>Staked</div>
            </div>
            <div className="sm:leading[1.33em] text-[16px] leading-[1.25em] text-white sm:text-[18px] lg:text-[24px] lg:leading-[1.25em]">
              {delegation.toLocaleString()} ISLM
            </div>
          </div> */}

          {/* <div className="flex flex-col items-start">
            <div className="mb-[6px]">
              <div className={grayTextClassName}>Rewards</div>
            </div>
            <div
              className="sm:leading[1.33em] text-[16px] leading-[1.25em] text-white sm:text-[18px] lg:text-[24px] lg:leading-[1.25em]"
              color="white"
            >
              {rewards.toLocaleString()} ISLM
            </div>
          </div> */}

          {/* <div className="flex flex-col items-start">
            <div className="mb-[6px]">
              <div className={grayTextClassName}>Address</div>
            </div>

            <div className="flex flex-col items-start space-y-2 font-sans lg:flex-row lg:space-x-4 lg:space-y-0">
              <div
                className="group flex cursor-pointer flex-row items-center justify-center space-x-[8px] text-white transition-colors duration-100 ease-in-out hover:text-gray-400"
                onClick={handleEthAddressCopy}
              >
                <div className="text-[18px] leading-[28px]">
                  {formattedAddress(ethAddress, width)}
                </div>

                <CopyIcon />
              </div>
              <div
                className="group flex cursor-pointer flex-row items-center justify-center space-x-[8px] text-white transition-colors duration-100 ease-in-out hover:text-gray-400"
                onClick={handleHaqqAddressCopy}
              >
                <div className="text-[18px] leading-[28px]">
                  {formattedAddress(haqqAddress, width)}
                </div>

                <CopyIcon />
              </div>

            </div>
          </div> */}
        </div>
      </div>
    </Container>
  );
}
