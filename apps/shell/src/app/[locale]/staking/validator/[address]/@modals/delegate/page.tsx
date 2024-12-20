'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatUnits } from 'viem';
import {
  useAddress,
  useIndexerBalanceQuery,
  useStakingDelegationQuery,
  useStakingParamsQuery,
  useStakingValidatorInfoQuery,
} from '@haqq/shell-shared';
import { DelegateModalHooked, secondsToDays } from '@haqq/shell-staking';

export default function DelegateModalSegment() {
  const { haqqAddress } = useAddress();
  const { address } = useParams<{ address: string }>();
  const { push, back } = useRouter();
  const { data: validatorInfo } = useStakingValidatorInfoQuery(address);
  const { data: stakingParams } = useStakingParamsQuery();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const [balance, setBalance] = useState<bigint>(0n);

  const validatorCommission = useMemo(() => {
    return (
      Number.parseFloat(
        validatorInfo?.commission.commission_rates.rate ?? '0',
      ) * 100
    );
  }, [validatorInfo?.commission.commission_rates.rate]);

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
    <DelegateModalHooked
      validatorAddress={address}
      isOpen
      onClose={() => {
        push(`/staking/validator/${address}`, { scroll: false });
        back();
      }}
      delegation={myDelegation}
      balance={balance}
      unboundingTime={unboundingTime}
      validatorCommission={validatorCommission}
      symbol="ISLM"
    />
  );
}
