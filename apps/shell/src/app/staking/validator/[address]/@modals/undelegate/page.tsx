'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Hex, formatUnits } from 'viem';
import {
  useAddress,
  useIndexerBalances,
  useStakingDelegationQuery,
  useStakingParamsQuery,
} from '@haqq/shell-shared';
import { UndelegateModalHooked, secondsToDays } from '@haqq/shell-staking';

export default function UndelegateModal() {
  const { haqqAddress } = useAddress();
  const { address } = useParams<{ address: string }>();
  const { push, back } = useRouter();
  const { data: stakingParams } = useStakingParamsQuery();
  const { getBalances } = useIndexerBalances();
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const [balance, setBalance] = useState(0);

  const unboundingTime = useMemo(() => {
    if (stakingParams?.unbonding_time) {
      return secondsToDays(stakingParams.unbonding_time);
    }

    return 0;
  }, [stakingParams]);

  useEffect(() => {
    if (haqqAddress) {
      getBalances(haqqAddress as Hex).then((balances) => {
        if (balances) {
          const { availableForStake } = balances;
          setBalance(availableForStake);
        }
      });
    }
  }, [getBalances, haqqAddress]);

  const myDelegation = useMemo(() => {
    const delegation = delegationInfo?.delegation_responses?.find(
      (delegation) => {
        return delegation.delegation.validator_address === address;
      },
    );

    if (delegation) {
      return Number.parseFloat(
        formatUnits(BigInt(delegation.balance.amount), 18),
      );
    }

    return 0;
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
