import { Container, Heading, SpinnerLoader, Text } from '@haqq/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProposalListCard } from '../proposal-list-card/proposal-list-card';
import { useCosmosService } from '@haqq/providers';

export function ProposalList() {
  const { getProposals } = useCosmosService();
  const { data: proposalsData, isFetching } = useQuery(
    ['proposals'],
    getProposals,
    {
      refetchOnWindowFocus: false,
    },
  );
  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData;
  }, [proposalsData]);

  return (
    <Container>
      <div className="mx-auto w-full max-w-6xl flex flex-col space-y-6">
        <div>
          <Heading level={2}>Governance</Heading>
        </div>
        {isFetching ? (
          <div className="mx-auto w-full max-w-6xl flex">
            <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-[200px]">
              <SpinnerLoader />
              <Text block>Fetching proposals</Text>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proposals.map((proposal: any) => {
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
