import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerLoader, Text } from '@haqq/ui-kit';
import { ProposalListCard } from '@haqq/governance/proposal-list';
import { useProposalListQuery } from '@haqq/shared';

export function ShellIndexPageProposalList() {
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData.slice(0, 10);
  }, [proposalsData]);

  if (isFetching) {
    return (
      <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-full select-none pointer-events-none py-[48px]">
        <SpinnerLoader className="text-white/10 !fill-haqq-orange w-10 h-10" />
        <div className="font-sans text-[10px] leading-[1.2em] uppercase">
          Fetching proposals
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6">
      {proposals.map((proposal) => {
        return (
          <Link
            to={`governance/proposal/${proposal.proposal_id}`}
            key={proposal.proposal_id}
          >
            <ProposalListCard proposal={proposal} />
          </Link>
        );
      })}
    </div>
  );
}
