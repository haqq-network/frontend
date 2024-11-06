import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import Link from 'next/link';
// import { useMediaQuery } from 'react-responsive';
import { Hex, formatUnits, parseUnits } from 'viem';
import {
  useAddress,
  useClipboard,
  useStakingRewardsQuery,
  getFormattedAddress,
  useWallet,
  useIndexerBalanceQuery,
  useStakingUnbondingsQuery,
} from '@haqq/shell-shared';
import { useStislmBalance, useStrideRates } from '@haqq/shell-staking';
import {
  Tooltip,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useHoverPopover,
} from '@haqq/shell-ui-kit';
import {
  OrangeLink,
  CopyIcon,
  Container,
  Heading,
  formatNumber,
  WalletIcon,
  InfoIcon,
  CoinIcon,
  LockIcon,
  StakedVestedBalance,
} from '@haqq/shell-ui-kit/server';

function MyAccountAmountBlock({
  title,
  value,
  subValue,
  isGreen = false,
  valueClassName,
}: {
  title: string;
  value: string | ReactNode;
  subValue?: string;
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
            ? 'font-clash text-[20px] leading-[26px] text-[#01B26E]'
            : 'font-guise text-[18px] leading-[28px] text-white',
          valueClassName,
        )}
      >
        {value}
      </div>
      {subValue ? (
        <div className="text-[14px] text-white/50">{subValue}</div>
      ) : null}
    </div>
  );
}

export function MyAccountBlock() {
  const { t } = useTranslate('common');
  const { ethAddress, haqqAddress } = useAddress();
  const { openSelectWallet } = useWallet();

  return !ethAddress || !haqqAddress ? (
    <div className="border-haqq-border bg-haqq-black/15 flex flex-col items-center space-y-[12px] border-y-[1px] py-[58px] backdrop-blur">
      <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
        {t('connect-wallet-message', 'You should connect wallet first')}
      </div>
      <Button
        onClick={openSelectWallet}
        variant={2}
        className="text-black hover:bg-transparent hover:text-white"
      >
        {t('connect-wallet-button', 'Connect wallet')}
      </Button>
    </div>
  ) : (
    <MyAccountConnected ethAddress={ethAddress} haqqAddress={haqqAddress} />
  );
}

function MyAccountConnected({
  ethAddress,
  haqqAddress,
}: {
  ethAddress: Hex;
  haqqAddress: string;
}) {
  const { t } = useTranslate();
  const [isEthAddressCopy, setEthAddressCopy] = useState<boolean>(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState<boolean>(false);
  const { copyText } = useClipboard();
  // const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  // const isMobile = useMediaQuery({
  //   query: `(max-width: 639px)`,
  // });
  // const isDesktop = useMediaQuery({
  //   query: `(min-width: 1024px)`,
  // });
  const symbol = 'ISLM';
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);

  // const delegation = useMemo(() => {
  //   if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
  //     let del = 0;

  //     for (const delegation of delegationInfo.delegation_responses) {
  //       del = del + Number.parseInt(delegation.balance.amount, 10);
  //     }

  //     return del / 10 ** 18;
  //   }

  //   return 0;
  // }, [delegationInfo]);

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      const totalRewards = Number.parseFloat(
        formatUnits(parseUnits(rewardsInfo.total[0].amount, 0), 18),
      );

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

  const {
    isHovered: isHoveredStaking,
    handleMouseEnter: handleMouseEnterStaking,
    handleMouseLeave: handleMouseLeaveStaking,
  } = useHoverPopover(100);

  // Hover state and handlers for liquid staking popover
  /*const {
    isHovered: isHoveredLiquidStaking,
    handleMouseEnter: handleMouseEnterLiquidStaking,
    handleMouseLeave: handleMouseLeaveLiquidStaking,
  } = useHoverPopover(100);*/

  const { stIslmBalance } = useStislmBalance();

  const { data: { islmAmountFromStIslm } = {} } = useStrideRates(stIslmBalance);

  if (!balances) {
    return null;
  }

  return (
    <Container className="border-haqq-border bg-haqq-black/15 border-y-[1px] backdrop-blur">
      <div className="font-guise flex flex-col py-[32px] sm:py-[22px] lg:py-[32px]">
        <div className="mb-[24px] flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            {t('my-account', 'My account', { ns: 'main' })}
          </Heading>
          <Link href="/staking" className="leading-[0]">
            <OrangeLink className="font-clash ml-[16px] !text-[12px] uppercase">
              {t('link-to-staking', 'Go to Staking', { ns: 'main' })}
            </OrangeLink>
          </Link>
        </div>

        <div className="flex flex-col space-y-6 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-6 lg:space-y-0">
          <div className="flex flex-col gap-y-[6px]">
            <div className="font-guise text-[10px] font-[600] uppercase leading-[14px] text-white/50 lg:text-[12px]">
              {t('balance', 'Balance', { ns: 'common' })}
            </div>
            <div className="flex flex-col justify-center gap-[4px]">
              <div className="font-clash text-[20px] font-[500] leading-[26px] text-white">
                {`${formatNumber(balances.balance)} ${symbol.toLocaleUpperCase()}`}
              </div>
              <div className="flex flex-col gap-[4px] leading-[0px]">
                <Popover open={isHoveredStaking} placement="top-start">
                  <PopoverTrigger
                    onMouseEnter={handleMouseEnterStaking}
                    onMouseLeave={handleMouseLeaveStaking}
                  >
                    <div
                      className={clsx(
                        'font-guise inline-flex cursor-help flex-row justify-center gap-[4px]',
                        'text-white hover:text-white/50',
                        'text-[12px] font-[500] leading-[18px]',
                        'transition-colors duration-150 ease-in-out',
                      )}
                    >
                      <span>
                        {t('available-staking', 'Available for staking', {
                          ns: 'main',
                        })}
                        {': '}
                        {formatNumber(balances.available)}
                      </span>
                      <InfoIcon className="ml-[2px] inline h-[18px] w-[18px]" />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="outline-none">
                    <StakingBalancePopup
                      haqqAddress={haqqAddress}
                      // TODO: does this make sense?
                      title={t(
                        'staking-balance-popup-message',
                        'In regular staking you can use coins in liquid staking',
                        { ns: 'main' },
                      )}
                    />
                  </PopoverContent>
                </Popover>

                {/* Popover for liquid staking information */}
                {/* <Popover open={isHoveredLiquidStaking} placement="top-start">
                  <PopoverTrigger
                    onMouseEnter={handleMouseEnterLiquidStaking}
                    onMouseLeave={handleMouseLeaveLiquidStaking}
                  >
                    <div
                      className={clsx(
                        'font-guise inline-flex cursor-help flex-row justify-center gap-[4px]',
                        'text-white hover:text-white/50',
                        'text-[12px] font-[500] leading-[18px]',
                        'transition-colors duration-150 ease-in-out',
                      )}
                    >
                      <span>
                        Available for liquid staking:{' '}
                        {formatNumber(balances.availableForStake)}
                      </span>
                      <InfoIcon className="ml-[2px] inline h-[18px] w-[18px]" />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="outline-none">
                    <StakingBalancePopup
                      haqqAddress={haqqAddress}
                      isLiquidStaking
                    />
                  </PopoverContent>
                </Popover> */}
              </div>
            </div>
          </div>
          <MyAccountAmountBlock
            title={t('regular-stacked', 'Regular STAKED', { ns: 'main' })}
            value={`${formatNumber(balances.staked)} ${symbol.toLocaleUpperCase()}`}
          />
          <MyAccountAmountBlock
            title={t('rewards', 'Rewards', { ns: 'main' })}
            value={`${formatNumber(rewards)} ${symbol.toLocaleUpperCase()}`}
          />
          <MyAccountAmountBlock
            title={t('liquid-stacked', 'Liquid STAKED', { ns: 'main' })}
            value={`${formatNumber(stIslmBalance)} stISLM`}
            subValue={`≈${formatNumber(islmAmountFromStIslm)} ISLM`}
          />
          <MyAccountAmountBlock
            title={t('address', 'Address', { ns: 'common' })}
            value={
              <div className="font-guise flex flex-col items-start space-y-2 lg:flex-row lg:space-x-4 lg:space-y-0">
                <div className="flex-1">
                  <Tooltip
                    text={
                      isEthAddressCopy
                        ? t('copied', 'Copied!', { ns: 'common' })
                        : `${t('click-to-copy', 'Click to copy', { ns: 'common' })} ${ethAddress}`
                    }
                  >
                    <div
                      className="flex cursor-pointer flex-row items-center gap-[8px] overflow-hidden text-[18px] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                      onClick={handleEthAddressCopy}
                    >
                      <div>
                        <span className="inline-block sm:hidden lg:inline-block">
                          {getFormattedAddress(ethAddress, 6, 6, '...')}
                        </span>
                        <span className="hidden sm:inline-block lg:hidden">
                          {ethAddress}
                        </span>
                      </div>

                      <CopyIcon className="mb-[-2px]" />
                    </div>
                  </Tooltip>
                </div>
                <div className="flex-1">
                  <Tooltip
                    text={
                      isHaqqAddressCopy
                        ? t('copied', 'Copied!', { ns: 'common' })
                        : `${t('click-to-copy', 'Click to copy', { ns: 'common' })} ${haqqAddress}`
                    }
                  >
                    <div
                      className="flex cursor-pointer flex-row items-center gap-[8px] text-[18px] leading-[28px] text-white transition-colors duration-100 ease-in-out hover:text-[#FFFFFF80]"
                      onClick={handleHaqqAddressCopy}
                    >
                      <div>
                        <span className="inline-block sm:hidden lg:inline-block">
                          {getFormattedAddress(haqqAddress, 6, 6, '...')}
                        </span>
                        <span className="hidden sm:inline-block lg:hidden">
                          {haqqAddress}
                        </span>
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

const useUnbonding = (haqqAddress: string) => {
  const { data: undelegations } = useStakingUnbondingsQuery(haqqAddress);
  const unbonding = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return Number.parseFloat(formatUnits(BigInt(result), 18));
  }, [undelegations]);

  return unbonding;
};

function StakingBalancePopup({
  haqqAddress,
  title,
  isLiquidStaking,
}: {
  haqqAddress: string;
  title?: string;
  isLiquidStaking?: boolean;
}) {
  const { t } = useTranslate('main');
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const unbonding = useUnbonding(haqqAddress);

  const { stIslmBalance } = useStislmBalance();

  if (!balances) {
    return null;
  }

  return (
    <div className="bg-haqq-black font-guise border-haqq-border max-w-[320px] transform-gpu rounded-lg border bg-opacity-90 text-white shadow-lg backdrop-blur">
      <div className="flex flex-col divide-y divide-white/15 px-[8px]">
        {title ? (
          <div className="py-[8px]">
            <p className="text-[12px] leading-[18px] text-[#8E8E8E]">{title}</p>
          </div>
        ) : null}
        <div className="py-[8px]">
          <div className="flex flex-row items-center gap-[4px]">
            <CoinIcon />
            <div className="text-[14px] leading-[22px] text-white">
              {t('available-for-stake', 'Available: {amount}', {
                amount: formatNumber(balances.availableForStake),
              })}
            </div>
          </div>
        </div>
        <div className="py-[8px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-row items-center gap-[4px]">
              <LockIcon />
              <div className="text-[14px] leading-[22px] text-white">
                {t('locked', 'Locked: {amount}', {
                  amount: isLiquidStaking
                    ? formatNumber(stIslmBalance + balances.locked)
                    : formatNumber(balances.locked),
                })}
              </div>
            </div>

            <div>
              <StakedVestedBalance
                available={balances.availableForStake}
                locked={balances.locked}
                staked={balances.staked}
                liquidStaked={isLiquidStaking ? stIslmBalance : 0}
                vested={balances.vested}
                daoLocked={balances.daoLocked}
                unbonding={unbonding}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
