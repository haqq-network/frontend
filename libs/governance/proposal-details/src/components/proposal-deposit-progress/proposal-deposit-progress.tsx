import { CardSubText, CardText } from '@haqq/shell/ui-kit-next';
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
    <div className="flex w-full flex-col space-y-[8px]">
      <div className="flex items-center space-x-[12px]">
        <CardText className="text-[13px] leading-[20px] lg:text-[16px] lg:leading-[26px]">
          Total deposit
        </CardText>
        {userDeposit && (
          <div className="inline-flex space-x-[6px]">
            <CardSubText className="text-white/50">
              You Deposited:{' '}
              <span className="text-white">{userDeposit.toFixed(0)}</span>
            </CardSubText>
          </div>
        )}
      </div>

      <div className="relative h-[8px] w-full overflow-hidden rounded-[4px] bg-[#FFFFFF26]">
        <div
          className="absolute left-0 top-0 h-[8px] rounded-[4px] bg-[#0489D4]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="font-sans text-[14px] font-[500] leading-[22px] text-white">
        {totalDeposit?.toLocaleString()} ISLM from {minDeposit.toLocaleString()}{' '}
        ISLM
      </div>
    </div>
  );
}
