'use client';
import { useMemo } from 'react';
import { ProposalStatus } from '@evmos/provider';
import Link from 'next/link';
import {
  useAddress,
  useGovernanceParamsQuery,
  useProposalListQuery,
  useProposalTallysQuery,
  useProposalVotesQuery,
  useWallet,
} from '@haqq/shell-shared';
import { Container, SpinnerLoader } from '@haqq/shell-ui-kit/server';
import { ProposalListCard } from './components/proposal-list-card';

export function ProposalListPage() {
  const { data: govParams } = useGovernanceParamsQuery();
  const { data: proposalsData } = useProposalListQuery();
  const symbol = 'ISLM';
  const { haqqAddress } = useAddress();
  const { isHaqqWallet } = useWallet();

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

  const proposalTallysDataArray = useProposalTallysQuery(ongoingProposals);
  const proposalUserVotesDataArray = useProposalVotesQuery(
    ongoingProposals,
    haqqAddress,
  );

  const ongoingProposalTallysResultMap = useMemo(() => {
    return new Map(
      proposalTallysDataArray.map((proposalQueryResult, index) => {
        const tallyData = proposalQueryResult.data;
        return [ongoingProposals[index], tallyData];
      }),
    );
  }, [ongoingProposals, proposalTallysDataArray]);

  const ongoingProposalVotesResultMap = useMemo(() => {
    return new Map(
      proposalUserVotesDataArray.map((proposalQueryResult, index) => {
        const userVote = proposalQueryResult.data;
        return [ongoingProposals[index], userVote];
      }),
    );
  }, [ongoingProposals, proposalUserVotesDataArray]);

  const proposalsToRender = useMemo(() => {
    return proposals.map((proposal) => {
      const updatetProposalData = proposal;
      let tallyResults = proposal.final_tally_result;

      if (updatetProposalData.status === ProposalStatus.Voting) {
        const ongoingTally = ongoingProposalTallysResultMap.get(
          updatetProposalData.proposal_id,
        );

        if (ongoingTally) {
          tallyResults = ongoingTally;
        }
      }

      const userVote = ongoingProposalVotesResultMap.get(
        updatetProposalData.proposal_id,
      );

      return {
        proposal: { ...proposal, tallyResults },
        userVote,
      };
    });
  }, [
    ongoingProposalTallysResultMap,
    ongoingProposalVotesResultMap,
    proposals,
  ]);

  return (
    <div>
      {!isHaqqWallet && (
        <div className="pt-[32px] lg:pt-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Governance
            </div>
          </Container>
        </div>
      )}

      <div className="pt-[32px] lg:pt-[68px]">
        <Container>
          {!govParams ? (
            <div className="pointer-events-none mx-auto flex min-h-[320px] w-full flex-1 select-none">
              <div className="flex min-h-full flex-1 flex-col items-center justify-center space-y-8">
                <SpinnerLoader />
                <div className="font-guise text-[10px] uppercase leading-[1.2em]">
                  Fetching proposals
                </div>
              </div>
            </div>
          ) : (
            <div className="3xl:grid-cols-4 mb-[68px] grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
              {proposalsToRender.map(({ userVote, proposal }) => {
                return (
                  <Link
                    href={`/governance/proposal/${proposal.proposal_id}`}
                    key={proposal.proposal_id}
                  >
                    <ProposalListCard
                      proposal={proposal}
                      govParams={govParams}
                      symbol={symbol}
                      proposalTally={proposal.tallyResults}
                      userVote={userVote}
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
