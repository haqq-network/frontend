import { useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { Card, CardHeading } from './card';
import { InfoBlock } from './info-block';
import { ProposalDepositProgress } from './proposal-deposit-progress';
import { ProposalStatus } from './proposal-status';
import { ProposalVoteProgress, VoteResults } from './proposal-vote-progress';
import { formatDate } from '../utils/format-date';

export const enum ProposalStatusEnum {
  Unspecified = 'PROPOSAL_STATUS_UNSPECIFIED',
  Deposit = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  Voting = 'PROPOSAL_STATUS_VOTING_PERIOD',
  Passed = 'PROPOSAL_STATUS_PASSED',
  Rejected = 'PROPOSAL_STATUS_REJECTED',
  Failed = 'PROPOSAL_STATUS_FAILED',
}

const ProposalPeriodTimer = dynamic(async () => {
  const { ProposalPeriodTimer } = await import('./proposal-period-timer');
  return { default: ProposalPeriodTimer };
});

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
  symbol,
  type,
  userVote,
  className,
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
  symbol: string;
  type: string;
  userVote?: string | null;
  className?: string;
}) {
  const { t } = useTranslate('common');
  const proposalColor = useMemo(() => {
    if (status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD') {
      return 'blue';
    }

    return 'green';
  }, [status]);

  return (
    <Card className={clsx('w-full', className)}>
      <div className="divide-haqq-border flex flex-col divide-y divide-dashed">
        <div className="flex flex-col gap-[16px] pb-[12px] md:pb-[22px]">
          <div className="flex flex-row items-center gap-[18px]">
            <div className="font-clash text-[14px] font-[500] leading-[18px] text-white md:py-[12[x]] md:text-[16px] md:leading-[22px] lg:text-[20px] lg:leading-[26px]">
              #{id}
            </div>
            <div>
              <ProposalStatus status={status} />
            </div>
          </div>
          <div>
            <div className="font-guise mb-[4px] text-[14px] leading-[22px] text-white/50">
              {type}
            </div>
            <div>
              <CardHeading
                className={clsx(
                  'line-clamp-2 h-[56px]',
                  status === ProposalStatusEnum.Failed && '!text-white/50',
                )}
              >
                {title}
              </CardHeading>
            </div>
          </div>
        </div>
        <div className="py-[12px] md:py-[22px]">
          {status === ProposalStatusEnum.Deposit && depositEndDate && (
            <ProposalPeriodTimer
              color={proposalColor}
              date={depositEndDate}
              title={t('deposit-end', 'Deposit end')}
            />
          )}
          {status === ProposalStatusEnum.Voting && votingEndDate && (
            <ProposalPeriodTimer
              color={proposalColor}
              date={votingEndDate}
              title={t('voting-end', 'Voting end')}
            />
          )}
          {(status === ProposalStatusEnum.Rejected ||
            status === ProposalStatusEnum.Passed ||
            status === ProposalStatusEnum.Failed) &&
            (votingStartDate || votingEndDate) && (
              <div className="my-[2px] flex flex-row items-center gap-[32px] md:my-0">
                {votingStartDate && (
                  <InfoBlock
                    title={t('voting-start', 'Voting Start')}
                    className={clsx(
                      status === ProposalStatusEnum.Failed && '!text-white/50',
                    )}
                  >
                    {formatDate(votingStartDate)}
                  </InfoBlock>
                )}
                {votingEndDate && (
                  <InfoBlock
                    title={t('voting-end', 'Voting end')}
                    className={clsx(
                      status === ProposalStatusEnum.Failed && '!text-white/50',
                    )}
                  >
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
              symbol={symbol}
            />
          )}
          {(status === ProposalStatusEnum.Voting ||
            status === ProposalStatusEnum.Rejected ||
            status === ProposalStatusEnum.Passed ||
            status === ProposalStatusEnum.Failed) && (
            <ProposalVoteProgress
              results={results}
              status={status}
              userVote={userVote}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
