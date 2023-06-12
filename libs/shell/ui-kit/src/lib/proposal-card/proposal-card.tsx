import { ProposalStatus as ProposalStatusEnum } from '@evmos/provider';
import { Card, CardHeading } from '../card/card';
import { ProposalDepositProgress } from '../proposal-deposit-progress/proposal-deposit-progress';
import {
  ProposalVoteProgress,
  VoteResults,
} from '../proposal-vote-progress/proposal-vote-progress';
import { ProposalStatus } from '../proposal-status/proposal-status';
import { ProposalPeriodTimer } from '../proposal-period-timer/proposal-period-timer';
import { InfoBlock } from '../info-block/info-block';
import { useMemo } from 'react';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'GMT',
  }).format(date);
}

export function ProposalCard({
  id,
  status,
  title,
  results,
  minDeposit,
  totalDeposit,
  depositEndDate,
  votingStartDate,
  votingEndDate,
}: {
  id: number;
  title: string;
  status: ProposalStatusEnum;
  minDeposit?: number;
  totalDeposit?: number;
  results: VoteResults;
  depositEndDate?: Date;
  votingStartDate?: Date;
  votingEndDate?: Date;
}) {
  const proposalColor = useMemo(() => {
    if (status === ProposalStatusEnum.Deposit) {
      return 'blue';
    }

    return 'green';
  }, [status]);

  return (
    <Card className="w-full">
      <div className="divide-haqq-border flex flex-col divide-y divide-dashed">
        <div className="flex flex-col gap-[16px] pb-[12px] md:pb-[22px]">
          <div className="flex flex-row items-center gap-[18px]">
            <div className="font-serif text-[14px] font-[500] leading-[18px] text-white md:py-[12[x]] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
              #{id}
            </div>
            <div>
              <ProposalStatus status={status} />
            </div>
          </div>
          <div>
            <CardHeading className="line-clamp-2 h-[56px]">{title}</CardHeading>
          </div>
        </div>
        <div className="py-[12px] md:py-[22px]">
          {status === ProposalStatusEnum.Deposit && depositEndDate && (
            <ProposalPeriodTimer
              color={proposalColor}
              date={depositEndDate}
              title="Deposit end"
            />
          )}
          {status === ProposalStatusEnum.Voting && votingEndDate && (
            <ProposalPeriodTimer
              color={proposalColor}
              date={votingEndDate}
              title="Voting end"
            />
          )}
          {(status === ProposalStatusEnum.Rejected ||
            status === ProposalStatusEnum.Passed) &&
            (votingStartDate || votingEndDate) && (
              <div className="my-[2px] flex flex-row items-center gap-[32px] md:my-0">
                {votingStartDate && (
                  <InfoBlock title="Voting start">
                    {formatDate(votingStartDate)}
                  </InfoBlock>
                )}
                {votingEndDate && (
                  <InfoBlock title="Voting end">
                    {formatDate(votingEndDate)}
                  </InfoBlock>
                )}
              </div>
            )}
        </div>
        <div className="pt-[12px] md:pt-[22px]">
          {status === ProposalStatusEnum.Deposit && (
            <ProposalDepositProgress
              minDeposit={minDeposit ?? 0}
              totalDeposit={totalDeposit ?? 0}
            />
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
