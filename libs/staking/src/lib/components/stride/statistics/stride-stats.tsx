import { useCallback, useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import { haqqTestedge2 } from 'viem/chains';
import { useAccount, useChains } from 'wagmi';
import {
  useAddress,
  useIndexerBalanceQuery,
  useNetworkAwareAction,
  useWallet,
} from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import {
  Container,
  formatNumber,
  Heading,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';
import { useStislmBalance } from '../../../hooks/use-stislm-balance';
import { useStrideRates } from '../../../hooks/use-stride-rates';
import {
  StakingStatsDesktopAmountBlock,
  StakingStatsMobileAmountBlock,
} from '../../staking-stats';

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

  const balance = balances?.availableForStake ?? 0;

  const { stIslmBalance } = useStislmBalance();

  const { data: { islmAmountFromStIslm } = {} } = useStrideRates(stIslmBalance);

  const isWalletConnected = Boolean(ethAddress && haqqAddress);

  if (!isWalletConnected) {
    return null;
  }

  return (
    <section
      className={clsx(
        'border-haqq-border bg-haqq-black/15 z-[49] w-full transform-gpu border-t backdrop-blur',
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
          islmAmountFromStIslm={islmAmountFromStIslm}
        />
      ) : (
        <StrideStatsDesktop
          balance={balance}
          stIslmBalance={stIslmBalance}
          islmAmountFromStIslm={islmAmountFromStIslm}
        />
      )}
    </section>
  );
}

export const useHandleDelegateContinue = () => {
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
};

function StrideStatsDesktop({
  balance,
  stIslmBalance,
  islmAmountFromStIslm,
}: {
  balance: number;
  stIslmBalance: number;
  islmAmountFromStIslm: number;
}) {
  const { t } = useTranslate();
  const { handleDelegateContinue, handleUndelegateContinue } =
    useHandleDelegateContinue();

  return (
    <Container className="flex min-h-[100px] flex-col justify-center gap-[24px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          {t('liquid-staking', 'Liquid staking', { ns: 'stacking' })}
        </Heading>
      </div>

      <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
        <div className="flex w-full flex-1 flex-row gap-[24px]">
          <div className="flex flex-row gap-[24px]">
            <div className="w-[240px]">
              <StakingStatsDesktopAmountBlock
                title={t('available', 'Available', { ns: 'stacking' })}
                value={formatNumber(balance)}
                symbol="ISLM"
                uppercaseSymbol={false}
              />
            </div>
            <div className="w-[240px]">
              <StakingStatsDesktopAmountBlock
                title={t('staked', 'Staked', { ns: 'stacking' })}
                value={formatNumber(stIslmBalance)}
                symbol="stISLM"
                uppercaseSymbol={false}
              />
            </div>
            <div className="w-[240px]">
              <StakingStatsDesktopAmountBlock
                title={t('stISLM-in-ISLM', 'stISLM in ISLM', {
                  ns: 'stacking',
                })}
                value={`≈${formatNumber(islmAmountFromStIslm)}`}
                symbol="ISLM"
                uppercaseSymbol={false}
              />
            </div>
          </div>

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
                {t('delegate', 'Delegate', { ns: 'common' })}
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
                {t('undelegate', 'Undelegate', { ns: 'common' })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

function StrideStatsMobile({
  balance,
  stIslmBalance,
  islmAmountFromStIslm,
}: {
  balance: number;
  stIslmBalance: number;
  islmAmountFromStIslm: number;
}) {
  const { t } = useTranslate();
  const { handleDelegateContinue, handleUndelegateContinue } =
    useHandleDelegateContinue();

  return (
    <div className="flex flex-col items-start gap-[16px] overflow-x-auto px-[16px] py-[20px] sm:gap-[32px] sm:px-[48px] sm:py-[32px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          {t('liquid-staking', 'Liquid staking', { ns: 'stacking' })}
        </Heading>
      </div>

      <div className="mt-[8px] flex w-full flex-1 flex-col gap-[8px]">
        <StakingStatsMobileAmountBlock
          title={t('available', 'Available', { ns: 'stacking' })}
          value={formatNumber(balance)}
          symbol="ISLM"
          uppercaseSymbol={false}
        />
        <StakingStatsMobileAmountBlock
          title={t('staked', 'Staked', { ns: 'stacking' })}
          value={formatNumber(stIslmBalance)}
          symbol="stISLM"
          uppercaseSymbol={false}
        />
        <StakingStatsMobileAmountBlock
          title={t('stISLM-in-ISLM', 'stISLM in ISLM', {
            ns: 'stacking',
          })}
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
          {t('delegate', 'Delegate', { ns: 'common' })}
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
          {t('undelegate', 'Undelegate', { ns: 'common' })}
        </Button>
      </div>
    </div>
  );
}
