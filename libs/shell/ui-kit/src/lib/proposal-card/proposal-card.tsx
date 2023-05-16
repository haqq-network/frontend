import { ProposalStatus as ProposalStatusEnum } from '@evmos/provider';
import { Card, CardHeading } from '../card/card';
import { ProposalDepositProgress } from '../proposal-deposit-progress/proposal-deposit-progress';
import {
  ProposalVoteProgress,
  VoteResults,
} from '../proposal-vote-progress/proposal-vote-progress';
import { ProposalStatus } from '../proposal-status/proposal-status';
import { ProposalPeriodTimer } from '../proposal-period-timer/proposal-period-timer';

export function ProposalCard({
  id,
  status,
  title,
  results,
  minDeposit,
  totalDeposit,
}: {
  id: number;
  title: string;
  status: ProposalStatusEnum;
  minDeposit: number;
  totalDeposit: number;
  results: VoteResults;
}) {
  return (
    <Card className="w-full">
      <div className="divide-haqq-border flex flex-col divide-y divide-dashed">
        <div className="flex flex-col gap-[16px] pb-[22px] md:pb-[12px]">
          <div className="flex flex-row items-center gap-[18px]">
            <div className="font-serif text-[14px] font-[500] leading-[18px] text-white md:py-[12[x]] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
              #{id}
            </div>
            <div>
              <ProposalStatus status={status} />
            </div>
          </div>
          <div>
            <CardHeading>{title}</CardHeading>
          </div>
        </div>
        <div className="py-[22px] md:py-[12px]">
          <ProposalPeriodTimer
            color="red"
            hours={1}
            days={2}
            minutes={4}
            title="depo"
          />
        </div>
        <div className="pt-[22px] md:pt-[12px]">
          {status === ProposalStatusEnum.Deposit && (
            <ProposalDepositProgress minDeposit={100} totalDeposit={40} />
          )}
          {(status === ProposalStatusEnum.Voting ||
            status === ProposalStatusEnum.Rejected ||
            status === ProposalStatusEnum.Passed) && (
            <ProposalVoteProgress results={results} status={status} />
          )}
        </div>
      </div>
    </Card>
  );
}
