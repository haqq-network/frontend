import {
  useAddress,
  useClipboard,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  getFormattedAddress,
  useWallet,
  useSupportedChains,
} from '@haqq/shared';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useBalance, useNetwork } from 'wagmi';
import {
  OrangeLink,
  CopyIcon,
  Container,
  Tooltip,
  Button,
  Heading,
  formatNumber,
  WalletIcon,
} from '@haqq/shell-ui-kit';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

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
    <div className="flex flex-col gap-y-[6px]">
      <div className="font-guise text-[10px] font-[600] uppercase leading-[14px] text-white/50 lg:text-[12px]">
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
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    chainId: chain?.id ?? chains[0].id,
  });
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const isMobile = useMediaQuery({
    query: `(max-width: 639px)`,
  });
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: formatNumber(Number.parseFloat(balanceData.formatted)),
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
      setEthAddressCopy(true);

      setTimeout(() => {
        setEthAddressCopy(false);
      }, 2500);
    }
  }, [copyText, ethAddress]);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (haqqAddress) {
      await copyText(haqqAddress);
      setHaqqAddressCopy(true);

      setTimeout(() => {
        setHaqqAddressCopy(false);
      }, 2500);
    }
  }, [copyText, haqqAddress]);

  return !ethAddress ? (
    <div className="flex flex-col items-center space-y-[12px] border-y border-[#ffffff26] py-[58px]">
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
    <Container className="border-y border-y-[#ffffff26]">
      <div className="flex flex-col py-[32px] font-sans sm:py-[22px] lg:py-[32px]">
        <div className="mb-[24px] flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            My account
          </Heading>
          <Link to="/staking" className="leading-[0]">
            <OrangeLink className="ml-[16px] font-serif !text-[12px] uppercase">
              Go to Staking
            </OrangeLink>
          </Link>
        </div>

        <div className="flex flex-col space-y-6 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-6 lg:space-y-0">
          <MyAccountAmountBlock
            title="Balance"
            value={`${balance?.value} ${symbol.toLocaleUpperCase()}`}
            valueClassName="!text-white"
            isGreen
          />
          <MyAccountAmountBlock
            title="Staked"
            value={`${formatNumber(delegation)} ${symbol.toLocaleUpperCase()}`}
          />
          <MyAccountAmountBlock
            title="Rewards"
            value={`${formatNumber(rewards)} ${symbol.toLocaleUpperCase()}`}
          />
          <MyAccountAmountBlock
            title="Address"
            value={
              <div className="flex flex-col items-start space-y-2 font-sans lg:flex-row lg:space-x-4 lg:space-y-0">
                <div className="flex-1">
                  <Tooltip
                    text={
                      isEthAddressCopy
                        ? 'Copied!'
                        : `Click to copy ${ethAddress}`
                    }
                  >
                    <div
                      className="flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                      onClick={handleEthAddressCopy}
                    >
                      <div>
                        {isMobile || isDesktop
                          ? getFormattedAddress(ethAddress, 6, 6, '...')
                          : ethAddress}
                      </div>

                      <CopyIcon className="mb-[-2px]" />
                    </div>
                  </Tooltip>
                </div>
                <div className="flex-1">
                  <Tooltip
                    text={
                      isHaqqAddressCopy
                        ? 'Copied!'
                        : `Click to copy ${haqqAddress}`
                    }
                  >
                    <div
                      className="flex cursor-pointer flex-row items-center gap-[8px] text-[18px] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                      onClick={handleHaqqAddressCopy}
                    >
                      <div>
                        {isMobile || isDesktop
                          ? getFormattedAddress(haqqAddress, 6, 6, '...')
                          : haqqAddress}
                      </div>
                      <CopyIcon className="mb-[-2px]" />
                    </div>
                  </Tooltip>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </Container>
  );
}
