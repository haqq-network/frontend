import { useMemo } from 'react';
export function StakedVestedBalance({
  staked,
  vested,
  symbol,
}: {
  staked: number;
  vested: number;
  symbol: string;
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

  if (vested === 0 && staked === 0) {
    return null;
  }

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
            Vested: {vested} {symbol}
          </div>
        )}
        {staked > 0 && (
          <div className="text-[12px] font-[500] leading-[18px] text-[#0489D4]">
            Staked: {staked} {symbol}
          </div>
        )}
      </div>
    </div>
  );
}
