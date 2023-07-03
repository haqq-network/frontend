import { useMemo } from 'react';
import {
  useAuthAccountsQuery,
  useStakingPoolQuery,
  useStakingValidatorListQuery,
  useBankSupplyQuery,
  useSupportedChains,
} from '@haqq/shared';
import { Card, CardHeading } from '@haqq/shell-ui-kit';
import { useNetwork } from 'wagmi';

export function ShellIndexPageChainStats() {
  const { data: stakingPool } = useStakingPoolQuery();
  const { data: validators } = useStakingValidatorListQuery();
  const { data: accounts } = useAuthAccountsQuery();
  const { data: bankSupply } = useBankSupplyQuery();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  const totalStaked = useMemo(() => {
    return Number.parseInt(stakingPool?.bonded_tokens ?? '0') / 10 ** 18;
  }, [stakingPool?.bonded_tokens]);

  const totalSupply = useMemo(() => {
    return Number.parseInt(bankSupply?.supply[0].amount ?? '0') / 10 ** 18;
  }, [bankSupply?.supply]);

  const totalAccounts = useMemo(() => {
    return Number.parseInt(accounts?.pagination.total ?? '0');
  }, [accounts?.pagination.total]);

  const { valsTotal, valsActive } = useMemo(() => {
    const activeVals = validators?.filter((val) => {
      return val.status === 'BondStatus.BONDED';
    });

    return {
      valsTotal: validators?.length ?? 0,
      valsActive: activeVals?.length ?? 0,
    };
  }, [validators]);

  return (
    <Card className="md:flex-1">
      <div className="flex h-full flex-col justify-between space-y-4">
        <div>
          <CardHeading>Total supply</CardHeading>
          <div className="text-2xl font-semibold leading-normal">
            {totalSupply.toLocaleString()}{' '}
            <span className="text-base">{symbol.toLocaleUpperCase()}</span>
          </div>
        </div>
        <div>
          <CardHeading>
            Total staked ({((totalStaked / totalSupply) * 100).toFixed(2)}%)
          </CardHeading>
          <div className="text-2xl font-semibold leading-normal">
            {totalStaked.toLocaleString()}{' '}
            <span className="text-base">{symbol.toLocaleUpperCase()}</span>
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
      </div>
    </Card>
  );
}
