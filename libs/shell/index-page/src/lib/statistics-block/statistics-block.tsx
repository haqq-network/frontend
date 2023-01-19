import {
  useAuthAccountsQuery,
  useBankSupplyQuery,
  useStakingPoolQuery,
  useStakingValidatorListQuery,
} from '@haqq/shared';
import { ShellText } from '@haqq/ui-kit';
import {
  BondStatus,
  bondStatusFromJSON,
} from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { useMemo } from 'react';

export function StatisticsBlock() {
  const { data: stakingPool } = useStakingPoolQuery();
  const { data: validators } = useStakingValidatorListQuery();
  const { data: accounts } = useAuthAccountsQuery();
  const { data: bankSupply } = useBankSupplyQuery();

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

  function formatNumber(number: number) {
    return number.toLocaleString('en-US').replace(/,/g, ' ');
  }

  return (
    <div className="flex w-full px-4 py-8 sm:px-16 sm:py-12 lg:px-20 lg:py-[68px]">
      <div className="flex flex-col space-y-[12px]">
        <div className="font-clash text-[28px] sm:text-[48px] lg:text-[70px] uppercase">
          Shell
        </div>
        <div className="flex flex-col lg:flex-wrap lg:flex-row space-y-[10px] lg:space-y-0 lg:gap-x-6 lg:gap-y-2">
          <div className="flex space-x-[9px]">
            <ShellText className="text-[12px] sm:text-[14px] tracking-[.01em] font-clash">
              total supply
            </ShellText>
            <div className="inline-flex space-x-[5px] font-guise text-[12px] leading-[1.5em] sm:text-[13px] sm:leading-[22px]">
              <ShellText color="white">{formatNumber(totalSupply)}</ShellText>
              <ShellText>ISLM</ShellText>
            </div>
          </div>
          <div className="flex space-x-[9px]">
            <ShellText className="text-[12px] sm:text-[14px] tracking-[.01em] font-clash">
              total staked ({((totalStaked / totalSupply) * 100).toFixed(2)}%)
            </ShellText>
            <div className="inline-flex space-x-[5px] font-guise text-[12px] leading-[1.5em] sm:text-[13px] sm:leading-[22px]">
              <ShellText color="white">{formatNumber(totalStaked)}</ShellText>
              <ShellText>ISLM</ShellText>
            </div>
          </div>
          <div className="flex space-x-[9px]">
            <ShellText className="text-[12px] sm:text-[14px] tracking-[.01em] font-clash">
              peers
            </ShellText>
            <div className="inline-flex space-x-[5px] font-guise text-[12px] leading-[1.5em] sm:text-[13px] sm:leading-[22px]">
              <ShellText color="white">{totalAccounts}</ShellText>
            </div>
          </div>
          <div className="flex space-x-[9px]">
            <ShellText className="text-[12px] sm:text-[14px] tracking-[.01em] font-clash">
              Active validators
            </ShellText>
            <div className="inline-flex space-x-[5px] font-guise text-[12px] leading-[1.5em] sm:text-[13px] sm:leading-[22px]">
              <ShellText color="white">{valsActive}</ShellText>
              <ShellText>out of {valsTotal}</ShellText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
