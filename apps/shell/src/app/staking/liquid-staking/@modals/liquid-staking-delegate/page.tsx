'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';
import {
  LiquidStakingDelegateModalHooked,
  useStrideRates,
} from '@haqq/shell-staking';

export default function LiquidStakingModalSegment() {
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

  const { data: { unbonding_period } = {} } = useStrideRates();

  return (
    <LiquidStakingDelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking`);
      }}
      balance={balance}
      unboundingTime={unbonding_period}
      symbol="ISLM"
    />
  );
}
