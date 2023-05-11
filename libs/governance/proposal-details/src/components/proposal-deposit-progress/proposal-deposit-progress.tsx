import { NewCardSubText, NewCardText } from '@haqq/ui-kit';
import { useMemo } from 'react';

export function ProposalDepositProgress({
  userDeposit,
  totalDeposit,
  minDeposit,
}: {
  userDeposit?: number;
  totalDeposit: number;
  minDeposit: number;
}) {
  const percent = useMemo(() => {
    return (totalDeposit / minDeposit) * 100;
  }, [minDeposit, totalDeposit]);

  return (
    <div className="flex flex-col w-full space-y-[8px]">
      <div className="flex space-x-[12px] items-center">
        <NewCardText className="text-[13px] leading-[20px] lg:text-[16px] lg:leading-[26px]">
          Total deposit
        </NewCardText>
        {userDeposit && (
          <div className="inline-flex space-x-[6px]">
            <NewCardSubText className="text-white/50">
              You Deposited:{' '}
              <span className="text-white">{userDeposit.toFixed(0)}</span>
            </NewCardSubText>
          </div>
        )}
      </div>

      <div className="w-full rounded-[4px] h-[8px] bg-[#FFFFFF26] relative overflow-hidden">
        <div
          className="rounded-[4px] h-[8px] bg-[#0489D4] absolute left-0 top-0"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-[14px] leading-[22px] font-[500] text-white font-sans">
        {totalDeposit?.toLocaleString()} ISLM from {minDeposit.toLocaleString()}{' '}
        ISLM
      </div>
    </div>
  );
}
