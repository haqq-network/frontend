import { useMemo } from 'react';
import clsx from 'clsx';
import { useMediaQuery } from 'usehooks-ts';
import { haqqTestedge2 } from 'viem/chains';
import { useAccount, useBalance, useChains } from 'wagmi';
import {
  useAddress,
  useIndexerBalanceQuery,
  useWallet,
} from '@haqq/shell-shared';
import { Button } from '@haqq/shell-ui-kit';
import {
  Container,
  formatNumber,
  Heading,
  WalletIcon,
} from '@haqq/shell-ui-kit/server';
import { useStrideRates } from '../../../hooks/use-stride-rates';
import {
  StakingStatsDesktopAmountBlock,
  StakingStatsMobileAmountBlock,
} from '../../staking-stats';

const stISLM = '0x12fEFEAc0568503F7C0D934c149f29a42B05C48f'; // '0x4FEBDDe47Ab9a76200e57eFcC80b212a07b3e6cE'; // '0x12fEFEAc0568503F7C0D934c149f29a42B05C48f';

export function StrideStats() {
  const { openSelectWallet, isHaqqWallet } = useWallet();

  const chains = useChains();
  const { chain = chains[0] } = useAccount();

  const isTablet = useMediaQuery('(max-width: 1023px)');

  const isTestedge = useMemo(() => {
    return chain.id === haqqTestedge2.id;
  }, [chain.id]);

  const { haqqAddress, ethAddress } = useAddress();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);

  const balance = balances?.availableForStake ?? 0;

  const { redemptionRate } = useStrideRates(haqqAddress);

  const balanceInStIslm = useBalance({
    token: stISLM,
    address: ethAddress,
  });

  const stIslmBalance = useMemo(() => {
    return Number.parseFloat(balanceInStIslm.data?.formatted ?? '0');
  }, [balanceInStIslm.data?.formatted]);

  const isWalletConnected = Boolean(ethAddress && haqqAddress);

  if (!isWalletConnected) {
    return (
      <section
        className={clsx(
          'border-haqq-border sticky z-[49] w-full transform-gpu border-y py-[32px] backdrop-blur',
          isTestedge
            ? 'top-[102px] sm:top-[111px]'
            : 'top-[62px] sm:top-[70px]',
        )}
      >
        <Container className="flex min-h-[100px] flex-col items-center justify-center gap-[12px]">
          <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            You should connect wallet first
          </div>
          <div>
            <Button
              onClick={openSelectWallet}
              variant={2}
              className="text-black hover:bg-transparent hover:text-white"
            >
              Connect wallet
            </Button>
          </div>
        </Container>
      </section>
    );
  }

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
      {isTablet ? (
        <StrideStatsMobile
          balance={balance}
          stIslmBalance={stIslmBalance}
          redemptionRate={redemptionRate}
        />
      ) : (
        <StrideStatsDesktop
          balance={balance}
          stIslmBalance={stIslmBalance}
          redemptionRate={redemptionRate}
        />
      )}
    </section>
  );
}

function StrideStatsDesktop({
  balance,
  stIslmBalance,
  redemptionRate,
}: {
  balance: number;
  stIslmBalance: number;
  redemptionRate: number;
}) {
  return (
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
                uppercaseSymbol={false}
              />
            </div>

            <div className="flex-1">
              <StakingStatsDesktopAmountBlock
                title="Staked"
                value={formatNumber(stIslmBalance)}
                symbol="stISLM"
                uppercaseSymbol={false}
              />
            </div>

            <div className="flex-1">
              <StakingStatsDesktopAmountBlock
                title="stISLM in ISLM"
                value={`≈${formatNumber(stIslmBalance * (redemptionRate ?? 1))}`}
                symbol="ISLM"
                uppercaseSymbol={false}
              />
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
  redemptionRate,
}: {
  balance: number;
  stIslmBalance: number;
  redemptionRate: number;
}) {
  return (
    <div className="flex flex-col items-start gap-[16px] overflow-x-auto px-[16px] py-[20px] sm:gap-[32px] sm:px-[48px] sm:py-[32px]">
      <div className="flex flex-row items-center">
        <WalletIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          My account
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
        <StakingStatsMobileAmountBlock
          title="stISLM in ISLM"
          value={`≈${formatNumber(stIslmBalance * (redemptionRate ?? 1))}`}
          symbol="ISLM"
          uppercaseSymbol={false}
        />
      </div>
    </div>
  );
}
