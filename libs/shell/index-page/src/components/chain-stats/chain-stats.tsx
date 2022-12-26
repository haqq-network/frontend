import { useMemo } from 'react';
import { Card, CardHeading } from '@haqq/ui-kit';
import {
  useAuthAccountsQuery,
  useStakingPoolQuery,
  useStakingValidatorListQuery,
  useBankSupplyQuery,
} from '@haqq/shared';
import {
  BondStatus,
  bondStatusFromJSON,
} from 'cosmjs-types/cosmos/staking/v1beta1/staking';

export function ShellIndexPageChainStats() {
  const { data: stakingPool } = useStakingPoolQuery();
  const { data: validators } = useStakingValidatorListQuery();
  const { data: accounts } = useAuthAccountsQuery();
  const { data: bankSupply } = useBankSupplyQuery();

  console.log({ accounts, bankSupply });

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.pool.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.pool.bonded_tokens]);

  const totalSupply = useMemo(() => {
    return Number.parseInt(bankSupply?.supply[0].amount ?? '0') / 10 ** 18;
  }, [bankSupply?.supply]);

  const totalAccounts = useMemo(() => {
    return Number.parseInt(accounts?.pagination.total ?? '0');
  }, [accounts?.pagination.total]);

  const { valsTotal, valsActive } = useMemo(() => {
    const activeVals = validators?.filter((val) => {
      return bondStatusFromJSON(val.status) === BondStatus.BOND_STATUS_BONDED;
    });
    return {
      valsTotal: validators?.length ?? 0,
      valsActive: activeVals?.length ?? 0,
    };
  }, [validators]);

  return (
    <Card className="grid grid-cols-1 gap-4">
      <div>
        <CardHeading>Total supply</CardHeading>
        <div className="text-2xl font-semibold leading-normal">
          {totalSupply.toLocaleString()} <span className="text-base">ISLM</span>
        </div>
      </div>
      <div>
        <CardHeading>
          Total staked ({((totalStaked / totalSupply) * 100).toFixed(2)}%)
        </CardHeading>
        <div className="text-2xl font-semibold leading-normal">
          {totalStaked.toLocaleString()} <span className="text-base">ISLM</span>
        </div>
      </div>
      <div>
        <CardHeading>Peers</CardHeading>
        <div className="text-2xl font-semibold leading-normal">
          {totalAccounts}
        </div>
      </div>
      <div>
        <CardHeading>Active validators</CardHeading>
        <div className="text-2xl font-semibold leading-normal">
          {valsActive} <span className="text-base">out of {valsTotal}</span>
        </div>
      </div>
    </Card>
  );
}
