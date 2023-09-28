import { ReactElement, useMemo } from 'react';
import { Proposal, ProposalStatus } from '@evmos/provider';
import { ProposalCard } from '@haqq/shell-ui-kit';
import { formatUnits } from 'viem/utils';
import { GetGovernanceParamsResponse, TallyResults } from '@haqq/shared';

export function ProposalListCard({
  proposal,
  govParams,
  symbol,
  proposalTally,
}: {
  proposal: Proposal;
  govParams: GetGovernanceParamsResponse;
  symbol: string;
  proposalTally: TallyResults;
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
      status={proposal.status as ProposalStatus}
      depositEndDate={new Date(proposal.deposit_end_time)}
      votingStartDate={new Date(proposal.voting_start_time)}
      votingEndDate={new Date(proposal.voting_end_time)}
      totalDeposit={totalDeposit}
      minDeposit={minDeposit}
      results={proposalTally}
      symbol={symbol}
    />
  );
}
