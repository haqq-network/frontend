'use client';
import { useRouter } from 'next/navigation';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';
import {
  LiquidStakingDelegateModalHooked,
  useStideStakingInfo,
} from '@haqq/shell-staking';

export default function LiquidStakingModalSegment() {
  const { haqqAddress } = useAddress();
  const { push } = useRouter();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const { data: strideStakingInfo } = useStideStakingInfo();

  return (
    <LiquidStakingDelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking`);
      }}
      balance={balances?.available ?? 0}
      unboundingTime={Number.parseFloat(
        strideStakingInfo?.unbonding_period ?? '0',
      )}
      symbol="ISLM"
    />
  );
}
