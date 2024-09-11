import { useMemo } from 'react';
import { formatNumber } from '../server';

export function StakedVestedBalance({
  available,
  locked,
  staked,
  vested,
  daoLocked,
  unbonding,
}: {
  available: number;
  locked: number;
  staked: number;
  vested: number;
  daoLocked: number;
  unbonding: number;
}) {
  const { vestedPercent, stakedPercent, daoLockedPercent, unbondingPercent } =
    useMemo(() => {
      const all = vested + staked + daoLocked + unbonding;
      const vestedPercent = (vested / all) * 100;
      const stakedPercent = (staked / all) * 100;
      const daoLockedPercent = (daoLocked / all) * 100;
      const unbondingPercent = (unbonding / all) * 100;

      return {
        vestedPercent,
        stakedPercent,
        daoLockedPercent,
        unbondingPercent,
      };
    }, [vested, staked, daoLocked, unbonding]);

  if (vested === 0 && staked === 0 && daoLocked === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-[4px]">
        {vested > 0 && (
          <div
            style={{ width: `${vestedPercent}%` }}
            className="h-[6px] min-w-[6px] rounded-[8px] bg-[#B26F1D]"
          />
        )}
        {staked > 0 && (
          <div
            className="h-[6px] min-w-[6px] rounded-[4px] bg-[#0489D4]"
            style={{ width: `${stakedPercent}%` }}
          />
        )}
        {daoLocked > 0 && (
          <div
            style={{ width: `${daoLockedPercent}%` }}
            className="h-[6px] min-w-[6px] rounded-[8px] bg-[#04D484]"
          />
        )}
        {unbonding > 0 && (
          <div
            style={{ width: `${unbondingPercent}%` }}
            className="h-[6px] min-w-[6px] rounded-[8px] bg-white/50"
          />
        )}
      </div>
      <div className="flex select-none flex-col justify-between pt-[4px] text-[12px] font-[500] leading-[18px]">
        {vested > 0 && (
          <div className="text-[#E3A13F]">Vested: {formatNumber(vested)}</div>
        )}
        {staked > 0 && (
          <div className="text-[#0489D4]">Staked: {formatNumber(staked)}</div>
        )}
        {daoLocked > 0 && (
          <div className="text-[#04D484]">
            UnitedContributorsDAO: {formatNumber(daoLocked)}
          </div>
        )}
        {unbonding > 0 && (
          <div className="text-white/50">
            Unbonding: {formatNumber(unbonding)}
          </div>
        )}
      </div>
    </div>
  );
}
