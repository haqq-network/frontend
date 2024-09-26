import { useMemo } from 'react';
import clsx from 'clsx';
import { useMediaQuery } from 'usehooks-ts';
import { haqqTestedge2 } from 'viem/chains';
import { useAccount, useChains } from 'wagmi';
import {
  useAddress,
  useIndexerBalanceQuery,
  useWallet,
} from '@haqq/shell-shared';
import {
  Container,
  formatNumber,
  Heading,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';
import { useStrideRates } from '../../../hooks/use-stride-rates';
import { StakingStatsDesktopAmountBlock } from '../../staking-stats';

export function StrideStats() {
  const { isHaqqWallet } = useWallet();

  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  const isTablet = useMediaQuery('(max-width: 1023px)');

  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  const { haqqAddress } = useAddress();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);

  const balance = balances?.availableForStake ?? 0;

  const { redemptionRate, isLoading, error } = useStrideRates(haqqAddress);

  const staked = 100;

  return (
    <section
      className={clsx(
        'border-haqq-border bg-haqq-black/15 z-[49] w-full transform-gpu border-y backdrop-blur',
        isHaqqWallet
          ? isTestedge
            ? 'top-[101px] sm:top-[111px]'
            : 'top-[62px] sm:top-[72px]'
          : isTestedge
            ? 'top-[99px] sm:top-[110px]'
            : 'top-[62px] sm:top-[70px]',
        isHaqqWallet && '!border-t-[0px]',
        !isTablet && 'sticky py-[32px]',
      )}
    >
      <Container className="flex min-h-[100px] flex-col justify-center gap-[24px]">
        <div className="flex flex-row items-center">
          <WalletIcon />
          <Heading level={3} className="mb-[-2px] ml-[8px]">
            Liquid staking
          </Heading>
        </div>
        <div className="flex w-full flex-col items-center gap-[16px] lg:flex-row lg:gap-[24px]">
          <div className="w-full flex-1">
            <div className="flex w-full flex-col gap-[8px] sm:flex-row sm:gap-[24px]">
              <div className="flex-1">
                <StakingStatsDesktopAmountBlock
                  title="Available"
                  value={formatNumber(balance)}
                  symbol="ISLM"
                />
              </div>

              <div className="flex-1">
                <StakingStatsDesktopAmountBlock
                  title="Staked"
                  value="257.12"
                  symbol="stISLM"
                />
              </div>

              <div className="flex-1">
                <StakingStatsDesktopAmountBlock
                  title="stISLM in ISLM"
                  value={`≈${formatNumber(staked * (redemptionRate ?? 1))}`}
                  symbol="ISLM"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
