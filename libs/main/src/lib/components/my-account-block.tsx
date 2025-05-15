import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
// import { useMediaQuery } from 'react-responsive';
import { Hex, formatUnits, parseUnits } from 'viem';
import {
  useAddress,
  useClipboard,
  useStakingRewardsQuery,
  getFormattedAddress,
  useWallet,
  useIndexerBalanceQuery,
  useFeatureFlag,
} from '@haqq/shell-shared';
import { useStislmBalance, useStrideRates } from '@haqq/shell-staking';
import {
  Tooltip,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useHoverPopover,
  ExpandableBlock,
} from '@haqq/shell-ui-kit';
import {
  OrangeLink,
  CopyIcon,
  Container,
  Heading,
  formatNumber,
  WalletIcon,
  InfoIcon,
} from '@haqq/shell-ui-kit/server';
import { StakingBalanceBlock } from './staking-balance-block';

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
    <div className="flex flex-col gap-y-[4px]">
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
        <div className="text-[12px] font-[500] leading-[18px] text-white/50">
          {subValue}
        </div>
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
  const { data: rewardsInfo } = useStakingRewardsQuery(haqqAddress);
  const symbol = 'ISLM';
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const stIslmBalance = useStislmBalance();
  const { data: { islmAmountFromStIslm } = {} } = useStrideRates(stIslmBalance);
  const isTablet = useMediaQuery('(max-width: 1023px)');
  const isLiquidStakingEnabled = useFeatureFlag('LIQUID_STAKING');

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

  // Hover state and handlers for staking popover
  const {
    isHovered: isHoveredStaking,
    handleMouseEnter: handleMouseEnterStaking,
    handleMouseLeave: handleMouseLeaveStaking,
  } = useHoverPopover(100);

  // Hover state and handlers for liquid staking popover
  const {
    isHovered: isHoveredLiquidStaking,
    handleMouseEnter: handleMouseEnterLiquidStaking,
    handleMouseLeave: handleMouseLeaveLiquidStaking,
  } = useHoverPopover(100);

  const lockedTokensDescription = t(
    'about-locked-tokens',
    'Locked tokens are your tokens but you cannot transfer to other users or use them to pay for gas, but you can delegate to validators - stake to improve the reliability of the HAQQ network, and make a profit. Locked tokens are unlocked according to the schedule.',
    { ns: 'main' },
  );

  const liquidStakingDescription = t(
    'about-liquid-staking',
    'Liquid staking allows you to delegate tokens to validators while maintaining liquidity. In return, you receive stISLM tokens that can be used in DeFi protocols while your staked ISLM continues to earn staking rewards.',
    { ns: 'main' },
  );
  if (!balances) {
    return null;
  }

  return (
    <Container className="border-haqq-border bg-haqq-black/15 border-y-[1px] backdrop-blur">
      <div className="font-guise flex flex-col py-[32px] sm:py-[22px] lg:py-[32px]">
        <div className="mb-[24px] flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ms-[8px]">
            {t('my-account', 'My account', { ns: 'common' })}
          </Heading>
          <Link href="/staking" className="leading-[0]">
            <OrangeLink className="font-clash ms-[16px] !text-[12px] uppercase">
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
                {isTablet ? (
                  <ExpandableBlock
                    title={`${t('available-staking', 'Available for staking', {
                      ns: 'main',
                    })}: ${formatNumber(balances.availableForStake)}`}
                    content={
                      <StakingBalanceBlock
                        haqqAddress={haqqAddress}
                        className="my-2 w-full !max-w-[100%] rounded-none border-x-0 !px-0"
                        description={lockedTokensDescription}
                      />
                    }
                  />
                ) : (
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
                          {formatNumber(balances.availableForStake)}
                        </span>
                        <InfoIcon className="ms-[2px] inline h-[18px] w-[18px]" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="outline-none">
                      <StakingBalanceBlock
                        haqqAddress={haqqAddress}
                        description={lockedTokensDescription}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Popover for liquid staking information */}
                {isLiquidStakingEnabled && (
                  <span>
                    {isTablet ? (
                      <ExpandableBlock
                        title={`Available for liquid staking: ${formatNumber(
                          balances.available,
                        )}`}
                        content={
                          <StakingBalanceBlock
                            haqqAddress={haqqAddress}
                            isLiquidStaking
                            className="my-2 w-full !max-w-[100%] rounded-none border-x-0 !px-0"
                            description={liquidStakingDescription}
                          />
                        }
                      />
                    ) : (
                      <Popover
                        open={isHoveredLiquidStaking}
                        placement="top-start"
                      >
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
                              {formatNumber(balances.available)}
                            </span>
                            <InfoIcon className="ms-[2px] inline h-[18px] w-[18px]" />
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="outline-none">
                          <StakingBalanceBlock
                            haqqAddress={haqqAddress}
                            isLiquidStaking
                            description={liquidStakingDescription}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <MyAccountAmountBlock
            title={t('regular-staked', 'Regular staked', { ns: 'main' })}
            value={`${formatNumber(balances.staked)} ${symbol.toLocaleUpperCase()}`}
          />
          <MyAccountAmountBlock
            title={t('rewards', 'Rewards', { ns: 'common' })}
            value={`${formatNumber(rewards)} ${symbol.toLocaleUpperCase()}`}
          />
          {isLiquidStakingEnabled && (
            <MyAccountAmountBlock
              title={t('liquid-staked', 'Liquid staked', { ns: 'main' })}
              value={`${formatNumber(stIslmBalance)} stISLM`}
              subValue={`≈${formatNumber(islmAmountFromStIslm ?? 0)} ISLM`}
            />
          )}
          <MyAccountAmountBlock
            title={t('address', 'Address', { ns: 'common' })}
            value={
              <div className="font-guise flex flex-col items-start space-y-2 lg:flex-row lg:space-x-4 lg:space-y-0">
                <div className="flex-1">
                  <Tooltip
                    text={
                      isEthAddressCopy
                        ? t('copied', 'Copied!', { ns: 'common' })
                        : t('click-to-copy-value', 'Click to copy {value}', {
                            ns: 'common',
                            value: ethAddress,
                          })
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
                        : t('click-to-copy-value', 'Click to copy {value}', {
                            ns: 'common',
                            value: haqqAddress,
                          })
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
