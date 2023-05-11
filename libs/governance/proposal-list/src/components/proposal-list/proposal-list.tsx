import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heading, SpinnerLoader } from '@haqq/ui-kit';
import { useProposalListQuery } from '@haqq/shared';
import { ProposalListCard } from '../proposal-list-card/proposal-list-card';

export function ProposalList() {
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData;
  }, [proposalsData]);

  return (
    <div className="mx-auto w-full flex flex-col space-y-6 px-4 py-8 sm:px-16 sm:py-12 lg:px-[79px] lg:py-[68px] flex-1">
      <div className="mb-[68px]">
        <Heading level={1} className="uppercase">
          Governance
        </Heading>
      </div>
      {isFetching ? (
        <div className="mx-auto w-full max-w-6xl flex-1 flex select-none pointer-events-none">
          <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-full">
            <SpinnerLoader className="text-white/10 !fill-haqq-orange w-10 h-10" />
            <div className="font-sans text-[10px] leading-[1.2em] uppercase">
              Fetching proposals
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
