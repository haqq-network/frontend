import { useMemo } from 'react';
export function StakedVestedBalance({
  staked,
  vested,
}: {
  staked: number;
  vested: number;
}) {
  const { vestedPercent, stakedPercent } = useMemo(() => {
    const all = vested + staked;
    const vestedPercent = (vested / all) * 100;
    const stakedPercent = (staked / all) * 100;
    return {
      vestedPercent,
      stakedPercent,
    };
  }, [vested, staked]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-[4px]">
        {staked > 0 && (
          <div
            className="h-[6px] min-w-[6px] rounded-[4px] bg-[#0489D4]"
            style={{ width: `${stakedPercent}%` }}
          />
        )}
        {vested > 0 && (
          <div
            className="h-[6px] min-w-[6px] rounded-[4px] bg-[#E3A13F]"
            style={{ width: `${vestedPercent}%` }}
          />
        )}
      </div>
      <div className="flex select-none flex-col justify-between pt-[4px]">
        {vested > 0 && (
          <div className="text-[12px] font-[500] leading-[18px] text-[#E3A13F]">
            Vested: {vested}
          </div>
        )}
        {staked > 0 && (
          <div className="text-[12px] font-[500] leading-[18px] text-[#0489D4]">
            Staked: {staked}
          </div>
        )}
      </div>
    </div>
  );
}
