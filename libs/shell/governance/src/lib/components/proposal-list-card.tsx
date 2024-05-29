import { ReactElement, useMemo } from 'react';
import { Proposal } from '@evmos/provider';
import { formatUnits } from 'viem/utils';
import {
  GetGovernanceParamsResponse,
  TallyResults,
} from '@haqq/data-access-cosmos';
import { ProposalCard, ProposalStatusEnum } from '@haqq/shell-ui-kit/server';
import { getProposalTypeText } from '../proposal-details-page';

export function ProposalListCard({
  proposal,
  govParams,
  symbol,
  proposalTally,
  userVote,
  className,
}: {
  proposal: Proposal;
  govParams: GetGovernanceParamsResponse;
  symbol: string;
  proposalTally: TallyResults;
  userVote?: string | null;
  className?: string;
}): ReactElement {
  const totalDeposit = useMemo(() => {
    if (!proposal.total_deposit[0]) {
      return 0;
    }

    return Number.parseFloat(
      formatUnits(BigInt(proposal.total_deposit[0].amount), 18),
    );
  }, [proposal]);
  const minDeposit = useMemo(() => {
    if (!govParams.deposit_params.min_deposit[0]) {
      return 0;
    }

    return Number.parseFloat(
      formatUnits(BigInt(govParams.deposit_params.min_deposit[0].amount), 18),
    );
  }, [govParams]);

  return (
    <ProposalCard
      title={proposal.content.title}
      id={Number.parseInt(proposal.proposal_id, 10)}
      status={proposal.status as ProposalStatusEnum}
      depositEndDate={new Date(proposal.deposit_end_time)}
      votingStartDate={new Date(proposal.voting_start_time)}
      votingEndDate={new Date(proposal.voting_end_time)}
      totalDeposit={totalDeposit}
      minDeposit={minDeposit}
      results={proposalTally}
      symbol={symbol}
      type={getProposalTypeText(proposal.content['@type'])}
      userVote={userVote}
      className={className}
    />
  );
}
