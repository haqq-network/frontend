'use client';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import { formatUnits } from 'viem';
import { haqqTestedge2 } from 'viem/chains';
import { useAccount, useChains } from 'wagmi';
import {
  useAddress,
  useIndexerBalanceQuery,
  useNetworkAwareAction,
  useWallet,
} from '@haqq/shell-shared';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useHoverPopover,
} from '@haqq/shell-ui-kit';
import {
  Container,
  formatDateShort,
  formatNumber,
  Heading,
  InfoIcon,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';
import {
  useLiquidStakingUnbondings,
  useStrideUnbondingDates,
  useStrideUnbondingTotal,
} from '../../../hooks/use-luquid-staking-queries';
import { useStislmBalance } from '../../../hooks/use-stislm-balance';
import { useStrideRates } from '../../../hooks/use-stride-rates';
import {
  StakingStatsDesktopAmountBlock,
  StakingStatsMobileAmountBlock,
} from '../../staking-stats';
import { StakingStatsExpandableBlock } from '../../staking-stats-expandable-block';
import { UnbondingTable } from '../unbonding-table';

const MIN_BALANCE = 0.2;
const MIN_DELEGATION = 0.01;

export function StrideStats() {
  const { isHaqqWallet } = useWallet();
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const isTablet = useMediaQuery('(max-width: 1023px)');
  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);
  const { haqqAddress, ethAddress } = useAddress();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const stIslmBalance = useStislmBalance();
  const { data: strideRates } = useStrideRates(stIslmBalance);
  const isWalletConnected = Boolean(ethAddress && haqqAddress);
  const balance = balances?.available ?? 0;
  const { data: strideUnbonding } = useLiquidStakingUnbondings(haqqAddress);
  const unbondingTotal = useStrideUnbondingTotal(strideUnbonding ?? []);

  if (!isWalletConnected) {
    return null;
  }

  return (
    <section
      className={clsx(
        'border-haqq-border bg-haqq-black/15 z-[40] w-full transform-gpu border-t-[1px] backdrop-blur',
        isHaqqWallet
          ? isTestedge
            ? 'top-[101px] sm:top-[111px]'
            : 'top-[62px] sm:top-[72px]'
          : isTestedge
            ? 'top-[99px] sm:top-[110px]'
            : 'top-[62px] sm:top-[70px]',
        isHaqqWallet && '!border-t-[0px]',
        !isTablet && 'py-[32px]',
      )}
    >
      {isTablet ? (
        <StrideStatsMobile
          balance={balance}
          stIslmBalance={stIslmBalance}
          islmAmountFromStIslm={strideRates?.islmAmountFromStIslm ?? 0}
          unbondingTotal={unbondingTotal}
        />
      ) : (
        <StrideStatsDesktop
          balance={balance}
          stIslmBalance={stIslmBalance}
          islmAmountFromStIslm={strideRates?.islmAmountFromStIslm ?? 0}
          unbondingTotal={unbondingTotal}
        />
      )}
    </section>
  );
}

export function useHandleDelegateContinue() {
  const { executeIfNetworkSupported } = useNetworkAwareAction();
  const router = useRouter();

  const handleDelegateContinue = useCallback(() => {
    executeIfNetworkSupported(() => {
      router.push(`/staking/liquid-staking/liquid-staking-delegate`, {
        scroll: false,
      });
    });
  }, [executeIfNetworkSupported, router]);

  const handleUndelegateContinue = useCallback(() => {
    executeIfNetworkSupported(() => {
      router.push(`/staking/liquid-staking/liquid-staking-undelegate`, {
        scroll: false,
      });
    });
  }, [executeIfNetworkSupported, router]);

  return { handleDelegateContinue, handleUndelegateContinue };
}

function StrideStatsDesktop({
  balance,
  stIslmBalance,
  islmAmountFromStIslm,
  unbondingTotal,
}: {
  balance: number;
  stIslmBalance: number;
  islmAmountFromStIslm: number;
  unbondingTotal: bigint;
}) {
  const { handleDelegateContinue, handleUndelegateContinue } =
    useHandleDelegateContinue();

  return (
    <Container className="flex min-h-[100px] flex-col justify-center gap-[24px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          Liquid staking
        </Heading>
      </div>

      <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
        <div className="flex w-full flex-1 flex-row gap-[24px]">
          <div className="flex flex-row gap-[24px]">
            <div className="w-[240px]">
              <StakingStatsDesktopAmountBlock
                title="Available"
                value={formatNumber(balance)}
                symbol="ISLM"
                uppercaseSymbol={false}
              />
            </div>
            <div className="w-[240px]">
              <StakingStatsDesktopAmountBlock
                title="Staked"
                value={formatNumber(stIslmBalance)}
                symbol="stISLM"
                uppercaseSymbol={false}
                subValue={`≈${formatNumber(islmAmountFromStIslm)} ISLM`}
              />
            </div>
            <div className="w-[240px]">
              <StakingStatsDesktopAmountBlock
                title="Unbonding"
                value={formatNumber(formatUnits(unbondingTotal, 18))}
                symbol="stISLM"
                uppercaseSymbol={false}
                subValue={<StrideUnbondings />}
              />
            </div>
          </div>

          {/* Delegate and Undelegate buttons */}
          <div className="flex flex-row gap-x-[12px]">
            <div className="flex-1">
              <Button
                variant={2}
                disabled={balance < MIN_BALANCE}
                className="w-full"
                onClick={() => {
                  handleDelegateContinue();
                }}
                data-attr="liquid-staking-delegate"
              >
                Delegate
              </Button>
            </div>

            <div className="flex-1">
              <Button
                variant={2}
                className="w-full"
                disabled={stIslmBalance < MIN_DELEGATION}
                data-attr="liquid-staking-undelegate"
                onClick={() => {
                  handleUndelegateContinue();
                }}
              >
                Undelegate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

function StrideUnbondings() {
  const { haqqAddress } = useAddress();
  const { data: strideUnbonding } = useLiquidStakingUnbondings(haqqAddress);
  const { firstDate, lastDate } = useStrideUnbondingDates(
    strideUnbonding ?? [],
  );
  const {
    isHovered: isHoveredStrideUnbondings,
    handleMouseEnter: handleMouseEnterStrideUnbondings,
    handleMouseLeave: handleMouseLeaveStrideUnbondings,
  } = useHoverPopover(100);

  if (!strideUnbonding?.length || !firstDate || !lastDate) {
    return null;
  }

  return (
    <Popover open={isHoveredStrideUnbondings} placement="top-start">
      <PopoverTrigger
        onMouseEnter={handleMouseEnterStrideUnbondings}
        onMouseLeave={handleMouseLeaveStrideUnbondings}
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
            {formatDateShort(firstDate)} - {formatDateShort(lastDate)}{' '}
          </span>
          <InfoIcon className="ml-[2px] inline h-[18px] w-[18px]" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="outline-none">
        <div className="bg-haqq-black font-guise border-haqq-border max-w-[320px] transform-gpu rounded-lg border bg-opacity-90 px-[8px] text-white shadow-lg backdrop-blur">
          <UnbondingTable strideUnbonding={strideUnbonding} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StrideStatsMobile({
  balance,
  stIslmBalance,
  islmAmountFromStIslm,
  unbondingTotal,
}: {
  balance: number;
  stIslmBalance: number;
  islmAmountFromStIslm: number;
  unbondingTotal: bigint;
}) {
  const { handleDelegateContinue, handleUndelegateContinue } =
    useHandleDelegateContinue();
  const isTablet = useMediaQuery('(max-width: 1023px)');
  const { haqqAddress } = useAddress();
  const { data: strideUnbonding } = useLiquidStakingUnbondings(haqqAddress);

  return (
    <div className="flex flex-col items-start gap-[16px] overflow-x-auto px-[16px] py-[20px] sm:gap-[32px] sm:px-[48px] sm:py-[32px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          Liquid staking
        </Heading>
      </div>

      <div className="mt-[8px] flex w-full flex-1 flex-col gap-[8px]">
        <StakingStatsMobileAmountBlock
          title="Available"
          value={formatNumber(balance)}
          symbol="ISLM"
          uppercaseSymbol={false}
        />
        <StakingStatsMobileAmountBlock
          title="Staked"
          value={formatNumber(stIslmBalance)}
          symbol="stISLM"
          uppercaseSymbol={false}
        />
        {isTablet ? (
          <StakingStatsExpandableBlock
            title="Unbonding"
            value={formatNumber(formatUnits(unbondingTotal, 18))}
            symbol="stISLM"
            uppercaseSymbol={false}
            content={
              <div className="border-haqq-border w-full border-y-[1px]">
                <UnbondingTable strideUnbonding={strideUnbonding ?? []} />
              </div>
            }
          />
        ) : (
          <StakingStatsMobileAmountBlock
            title="Unbonding"
            value={formatNumber(formatUnits(unbondingTotal, 18))}
            symbol="stISLM"
            uppercaseSymbol={false}
          />
        )}
        <StakingStatsMobileAmountBlock
          title="stISLM in ISLM"
          value={`≈${formatNumber(islmAmountFromStIslm)}`}
          symbol="ISLM"
          uppercaseSymbol={false}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-x-[12px]">
        <Button
          variant={2}
          disabled={balance < MIN_BALANCE}
          className="w-full"
          onClick={() => {
            handleDelegateContinue();
          }}
          data-attr="liquid-staking-delegate"
        >
          Delegate
        </Button>

        <Button
          variant={2}
          className="w-full"
          disabled={stIslmBalance < MIN_DELEGATION}
          data-attr="liquid-staking-undelegate"
          onClick={() => {
            handleUndelegateContinue();
          }}
        >
          Undelegate
        </Button>
      </div>
    </div>
  );
}
