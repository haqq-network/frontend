import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProposalListQuery } from '@haqq/shared';
import { ProposalListCard } from '../proposal-list-card/proposal-list-card';
import { Heading, SpinnerLoader } from '@haqq/shell/ui-kit';

export function ProposalList() {
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData;
  }, [proposalsData]);

  return (
    <div className="mx-auto flex w-full flex-1 flex-col px-4 py-8 sm:px-16 sm:py-12 lg:px-[79px] lg:py-[68px]">
      <div className="mb-[68px]">
        <Heading level={1} className="uppercase">
          Governance
        </Heading>
      </div>
      {isFetching ? (
        <div className="pointer-events-none mx-auto flex w-full max-w-6xl flex-1 select-none">
          <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
            <SpinnerLoader />
            <div className="font-sans text-[10px] uppercase leading-[1.2em]">
              Fetching proposals
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {proposals.map((proposal) => {
            return (
              <Link
                to={`proposal/${proposal.proposal_id}`}
                key={proposal.proposal_id}
              >
                <ProposalListCard proposal={proposal} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
