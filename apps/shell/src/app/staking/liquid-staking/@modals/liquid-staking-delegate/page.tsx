'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';
import { LiquidStakingDelegateModalHooked } from '@haqq/shell-staking';

export default function LiquidStakingModalSegment() {
  const { haqqAddress } = useAddress();
  const { push, back } = useRouter();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (balances) {
      const { availableForStake } = balances;
      setBalance(availableForStake);
    }
  }, [balances]);

  return (
    <LiquidStakingDelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking`);
        back();
      }}
      balance={balance}
      unboundingTime={21}
      symbol="ISLM"
    />
  );
}
