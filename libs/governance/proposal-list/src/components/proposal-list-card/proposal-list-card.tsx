import { ReactElement, useMemo } from 'react';
import { Proposal, ProposalStatus } from '@evmos/provider';
import { ProposalCard } from '@haqq/shell/ui-kit';
import { GovernanceParamsResponse } from '@haqq/shared';
import { formatUnits } from 'ethers/lib/utils.js';

export function ProposalListCard({
  proposal,
  govParams,
}: {
  proposal: Proposal;
  govParams: GovernanceParamsResponse;
}): ReactElement {
  // console.log({ proposal, govParams });
  const totalDeposit = useMemo(() => {
    if (proposal.total_deposit.length === 0) {
      return 0;
    }

    return Number.parseInt(formatUnits(proposal.total_deposit[0]?.amount), 10);
  }, [proposal]);
  const minDeposit = useMemo(() => {
    if (!govParams.deposit_params.min_deposit[0]) {
      return 0;
    }

    return Number.parseFloat(
      formatUnits(govParams.deposit_params.min_deposit[0].amount, 18),
      // 10,
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
      results={{
        abstain: '100',
        yes: '1000',
        no: '300',
        no_with_veto: '20',
      }}
    />
  );
}
