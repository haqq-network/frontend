import { useMemo } from 'react';
import { ProposalStatus } from '@evmos/provider';
import { Link } from 'react-router-dom';
import {
  useGovernanceParamsQuery,
  useProposalListQuery,
  useProposalTallys,
} from '@haqq/shared';
import { Container, SpinnerLoader } from '@haqq/shell-ui-kit';
import { ProposalListCard } from '../proposal-list-card/proposal-list-card';

export function ProposalList() {
  const { data: govParams } = useGovernanceParamsQuery();
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const symbol = 'ISLM';

  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData;
  }, [proposalsData]);

  const ongoingProposals = useMemo(() => {
    return proposals
      .filter((proposal) => {
        return proposal.status === ProposalStatus.Voting;
      })
      .map((proposal) => {
        return proposal.proposal_id;
      });
  }, [proposals]);

  const proposalTallysDataArray = useProposalTallys(ongoingProposals);

  const ongoingProposalTallysResultMap = useMemo(() => {
    return new Map(
      proposalTallysDataArray.map((proposalQueryResult, index) => {
        const tallyData = proposalQueryResult.data;
        return [ongoingProposals[index], tallyData];
      }),
    );
  }, [ongoingProposals, proposalTallysDataArray]);

  const proposalsToRender = useMemo(() => {
    return proposals.map((proposal) => {
      let tallyResults = proposal.final_tally_result;

      if (proposal.status === ProposalStatus.Voting) {
        const ongoingTally = ongoingProposalTallysResultMap.get(
          proposal.proposal_id,
        );

        if (ongoingTally) {
          tallyResults = ongoingTally;
        }
      }

      return {
        ...proposal,
        tallyResults,
      };
    });
  }, [ongoingProposalTallysResultMap, proposals]);

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Governance
          </div>
        </Container>
      </div>

      <div>
        <Container>
          {!govParams || isFetching ? (
            <div className="pointer-events-none mx-auto flex min-h-[320px] w-full flex-1 select-none">
              <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
                <SpinnerLoader />
                <div className="font-sans text-[10px] uppercase leading-[1.2em]">
                  Fetching proposals
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-[68px] grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {proposalsToRender.map((proposal) => {
                return (
                  <Link
                    to={`proposal/${proposal.proposal_id}`}
                    key={proposal.proposal_id}
                  >
                    <ProposalListCard
                      proposal={proposal}
                      govParams={govParams}
                      symbol={symbol}
                      proposalTally={proposal.tallyResults}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
