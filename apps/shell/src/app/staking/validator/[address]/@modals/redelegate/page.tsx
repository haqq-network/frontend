'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatUnits } from 'viem';
import {
  useAddress,
  useIndexerBalanceQuery,
  useStakingDelegationQuery,
  useStakingValidatorListQuery,
} from '@haqq/shell-shared';
import { RedelegateModalHooked } from '@haqq/shell-staking';

export default function RedelegateModal() {
  const { haqqAddress } = useAddress();
  const { address } = useParams<{ address: string }>();
  const { push, back } = useRouter();
  const { data: validatorsList } = useStakingValidatorListQuery(1000);
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);
  const { data: delegationInfo } = useStakingDelegationQuery(haqqAddress);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (balances) {
      const { availableForStake } = balances;
      setBalance(availableForStake);
    }
  }, [balances]);

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
    <RedelegateModalHooked
      validatorAddress={address}
      isOpen
      onClose={() => {
        push(`/staking/validator/${address}`, { scroll: false });
        back();
      }}
      delegation={myDelegation}
      validatorsList={validatorsList}
      balance={balance}
      symbol="ISLM"
    />
  );
}
