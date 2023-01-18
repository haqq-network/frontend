import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerLoader, Text } from '@haqq/ui-kit';
import { NewProposalListCard } from '@haqq/governance/proposal-list';
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
      <div className="mx-auto w-full flex">
        <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-[200px]">
          <SpinnerLoader />
          <Text block>Fetching proposals</Text>
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
            <NewProposalListCard proposal={proposal} />
          </Link>
        );
      })}
    </div>
  );
}
