'use client';
import { useRouter } from 'next/navigation';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';
import {
  LiquidStakingUndelegateModalHooked,
  useStideStakingInfo,
  useStislmBalance,
} from '@haqq/shell-staking';

export default function LiquidStakingUndelegateModalSegment() {
  const { haqqAddress } = useAddress();
  const { push } = useRouter();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);

  const { data } = useStideStakingInfo();
  const stIslmBalance = useStislmBalance();

  return (
    <LiquidStakingUndelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking`);
      }}
      delegation={stIslmBalance}
      balance={balances?.availableForStake ?? 0}
      unboundingTime={Number.parseFloat(data?.unbonding_period ?? '0')}
      symbol="stISLM"
    />
  );
}
