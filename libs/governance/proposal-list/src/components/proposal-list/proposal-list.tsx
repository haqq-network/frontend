import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Heading, SpinnerLoader, Text } from '@haqq/ui-kit';
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
    <Container>
      <div className="mx-auto w-full flex flex-col space-y-6">
        <div>
          <Heading level={2}>Governance</Heading>
        </div>
        {isFetching ? (
          <div className="mx-auto w-full flex">
            <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-[200px]">
              <SpinnerLoader />
              <Text block>Fetching proposals</Text>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
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
    </Container>
  );
}
