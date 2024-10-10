'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';
import {
  LiquidStakingUndelegateModalHooked,
  useStislmBalance,
  useStideStakingInfo,
} from '@haqq/shell-staking';

export default function LiquidStakingUndelegateModalSegment() {
  const { haqqAddress } = useAddress();
  const { push } = useRouter();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (balances) {
      const { availableForStake } = balances;
      setBalance(availableForStake);
    }
  }, [balances]);

  const { data: { unbonding_period } = {} } = useStideStakingInfo();
  const { stIslmBalance } = useStislmBalance();

  return (
    <LiquidStakingUndelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking`);
      }}
      delegation={stIslmBalance}
      balance={balance}
      unboundingTime={unbonding_period}
      symbol="ISLM"
    />
  );
}
