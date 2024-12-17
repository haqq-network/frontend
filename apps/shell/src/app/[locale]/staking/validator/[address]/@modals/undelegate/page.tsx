'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useAddress,
  useIndexerBalanceQuery,
  useStakingDelegationQuery,
  useStakingParamsQuery,
} from '@haqq/shell-shared';
import { UndelegateModalHooked, secondsToDays } from '@haqq/shell-staking';

export default function UndelegateModalSegment() {
  const { haqqAddress } = useAddress();
  const { address } = useParams<{ address: string }>();
  const { push, back } = useRouter();
  const { data: stakingParams } = useStakingParamsQuery();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const [balance, setBalance] = useState(0n);

  const unboundingTime = useMemo(() => {
    if (stakingParams?.unbonding_time) {
      return secondsToDays(stakingParams.unbonding_time);
    }

    return 0;
  }, [stakingParams]);

  useEffect(() => {
    if (balances) {
      const { availableForStakeBn } = balances;
      setBalance(availableForStakeBn);
    }
  }, [balances]);

  const myDelegation = useMemo(() => {
    const delegation = delegationInfo?.delegation_responses?.find(
      (delegation) => {
        return delegation.delegation.validator_address === address;
      },
    );

    if (delegation) {
      return BigInt(delegation.balance.amount);
    }

    return 0n;
  }, [delegationInfo, address]);

  return (
    <UndelegateModalHooked
      isOpen
      onClose={() => {
        push(`/staking/validator/${address}`, { scroll: false });
        back();
      }}
      validatorAddress={address}
      delegation={myDelegation}
      balance={balance}
      unboundingTime={unboundingTime}
      symbol="ISLM"
    />
  );
}
