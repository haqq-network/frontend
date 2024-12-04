import { formatUnits } from 'viem';
import { formatDateShort, formatNumber } from '@haqq/shell-ui-kit/server';
import { StrideUnbonding } from '../../hooks/use-luquid-staking-queries';

export function UnbondingTable({
  strideUnbonding,
}: {
  strideUnbonding: StrideUnbonding[];
}) {
  if (strideUnbonding.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col divide-y divide-white/15">
      <div className="py-[8px]">
        <p className="text-[12px] leading-[18px] text-[#8E8E8E]">
          This table shows the amount of stISLM you will receive and the date
          when your unbonding will be completed.
        </p>
      </div>

      {/* Add unbonding details table */}
      {strideUnbonding?.length > 0 && (
        <div className="py-[8px]">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] text-[#8E8E8E]">
                <th className="text-left">Amount</th>
                <th className="text-right">Unlock date</th>
              </tr>
            </thead>
            <tbody>
              {strideUnbonding.map((unbonding, index) => {
                return (
                  <tr key={index} className="text-[12px]">
                    <td className="py-1 text-left">
                      {formatNumber(formatUnits(unbonding.amount, 18))} stISLM
                    </td>
                    <td className="py-1 text-right">
                      {formatDateShort(new Date(unbonding.estimatedTime))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
