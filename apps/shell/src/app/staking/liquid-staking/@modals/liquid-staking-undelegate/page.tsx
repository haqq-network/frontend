'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress, useIndexerBalanceQuery } from '@haqq/shell-shared';
import {
  LiquidStakingUndelegateModalHooked,
  useStislmBalance,
} from '@haqq/shell-staking';

export default function LiquidStakingUndelegateModalSegment() {
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

  const { stIslmBalance } = useStislmBalance();

  return (
    <LiquidStakingUndelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking`, { scroll: false });
        back();
      }}
      delegation={stIslmBalance}
      balance={balance}
      unboundingTime={21}
      symbol="ISLM"
    />
  );
}
