import {
  // useAuthAccountsQuery,
  // useBankSupplyQuery,
  // useStakingParamsQuery,
  // useStakingPoolQuery,
  // useStakingValidatorListQuery,
  useSupportedChains,
} from '@haqq/shared';
// import {
//   BondStatus,
//   bondStatusFromJSON,
// } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

export function StatisticsBlock() {
  // const { data: stakingPool } = useStakingPoolQuery();
  // const { data: validators } = useStakingValidatorListQuery();
  // const { data: accounts } = useAuthAccountsQuery();
  // const { data: bankSupply } = useBankSupplyQuery();
  // const { data: stakingParams } = useStakingParamsQuery();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;

  // const totalStaked = useMemo(() => {
  //   return Number.parseInt(stakingPool?.bonded_tokens ?? '0') / 10 ** 18;
  // }, [stakingPool?.bonded_tokens]);

  // const totalSupply = useMemo(() => {
  //   return Number.parseInt(bankSupply?.supply[0].amount ?? '0') / 10 ** 18;
  // }, [bankSupply?.supply]);

  // const totalAccounts = useMemo(() => {
  //   return Number.parseInt(accounts?.pagination.total ?? '0');
  // }, [accounts?.pagination.total]);

  const totalStaked = 1561205227.874;

  const totalSupply = 20_000_000_000.0;

  const totalAccounts = 2516427;

  const { valsTotal, valsActive } = useMemo(() => {
    // const activeVals = validators?.filter((val) => {
    //   return bondStatusFromJSON(val.status) === BondStatus.BOND_STATUS_BONDED;
    // });

    return {
      valsTotal: 150,
      valsActive: 68,
    };
  }, []); // [stakingParams?.max_validators, validators]

  return (
    <div className="flex flex-col gap-y-[10px] lg:flex-row lg:flex-wrap lg:gap-x-[24px]">
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="mb-[-3px] font-serif text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Total supply
        </div>
        <div className="inline-flex space-x-[5px] font-sans text-[12px] font-[500] leading-[24px] sm:text-[13px] sm:leading-[22px]">
          {totalSupply.toLocaleString()}
          <span className="text-white/50">
            &nbsp;{symbol.toLocaleUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="mb-[-3px] font-serif text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Total staked ({((totalStaked / totalSupply) * 100).toFixed(2)}%)
        </div>
        <div className="inline-flex space-x-[5px] font-sans text-[12px] font-[500] leading-[24px] sm:text-[13px] sm:leading-[22px]">
          <div>
            {totalStaked.toLocaleString()}
            <span className="text-white/50">
              &nbsp;{symbol.toLocaleUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="mb-[-3px] font-serif text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Accounts
        </div>
        <div className="inline-flex space-x-[5px] font-sans text-[12px] font-[500] leading-[24px] sm:text-[13px] sm:leading-[22px]">
          {totalAccounts}
        </div>
      </div>
      <div className="flex flex-row items-center space-x-[9px]">
        <div className="mb-[-3px] font-serif text-[12px] uppercase leading-[20px] tracking-[.01em] text-white/50 sm:text-[14px]">
          Active validators
        </div>
        <div className="inline-flex space-x-[5px] font-sans text-[12px] font-[500] leading-[24px] sm:text-[13px] sm:leading-[22px]">
          <div>
            {valsActive}
            <span className="text-white/50">&nbsp;out of {valsTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
