import { useMemo } from 'react';
import { ProposalStatus } from '@evmos/provider';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';
import { ProposalListCard } from '@haqq/shell-governance';
import {
  useGovernanceParamsQuery,
  useProposalListQuery,
  useProposalTallysQuery,
} from '@haqq/shell-shared';
import {
  Heading,
  Container,
  OrangeLink,
  ProposalsIcon,
  SpinnerLoader,
} from '@haqq/shell-ui-kit/server';

export function ProposalListBlock() {
  const { t } = useTranslate();
  const { data: govParams } = useGovernanceParamsQuery();
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const symbol = 'ISLM';

  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData.slice(0, 10);
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
    <Container>
      <div className="mb-[24px] flex flex-row items-center">
        <ProposalsIcon />
        <Heading level={3} className="mb-[-2px] ml-[8px]">
          {t('latest-proposals', 'Latest proposals', { ns: 'main' })}
        </Heading>
        <Link href="/governance" className="leading-[0]">
          <OrangeLink className="font-clash ml-[16px] !text-[12px] uppercase">
            {t('link-to-governance', 'Go to Governance', { ns: 'main' })}
          </OrangeLink>
        </Link>
      </div>

      {isFetching || !govParams ? (
        <div className="pointer-events-none flex min-h-full flex-1 select-none flex-col items-center justify-center space-y-8 py-[48px]">
          <SpinnerLoader />
          <div className="font-guise text-[10px] uppercase leading-[1.2em]">
            {t('fetching-proposals', 'Fetching proposals', { ns: 'common' })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {proposalsToRender.map((proposal) => {
            return (
              <Link
                key={proposal.proposal_id}
                href={`governance/proposal/${proposal.proposal_id}`}
                className="2xl:last-of-type:hidden"
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
  );
}
