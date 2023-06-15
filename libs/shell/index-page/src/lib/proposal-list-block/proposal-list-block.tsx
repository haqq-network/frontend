import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProposalListCard } from '@haqq/governance/proposal-list';
import {
  useGovernanceParamsQuery,
  useProposalListQuery,
  useSupportedChains,
} from '@haqq/shared';
import {
  Heading,
  Container,
  OrangeLink,
  ProposalsIcon,
  SpinnerLoader,
} from '@haqq/shell-ui-kit';
import { useNetwork } from 'wagmi';

export function ProposalListBlock() {
  const { data: govParams } = useGovernanceParamsQuery();
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const symbol =
    chain?.nativeCurrency.symbol ?? chains[0]?.nativeCurrency.symbol;
  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData.slice(0, 10);
  }, [proposalsData]);

  return (
    <Container>
      <div className="mb-[24px] flex flex-row items-center">
        <ProposalsIcon />
        <Heading level={3} className="ml-[8px]">
          Latest proposals
        </Heading>
        <Link to="/governance">
          <OrangeLink className="ml-[16px] font-serif !text-[12px] uppercase">
            Go to Governance
          </OrangeLink>
        </Link>
      </div>

      {isFetching || !govParams ? (
        <div className="pointer-events-none flex min-h-full flex-1 select-none flex-col items-center justify-center space-y-8 py-[48px]">
          <SpinnerLoader />
          <div className="font-sans text-[10px] uppercase leading-[1.2em]">
            Fetching proposals
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {proposals.map((proposal) => {
            return (
              <Link
                to={`governance/proposal/${proposal.proposal_id}`}
                key={proposal.proposal_id}
              >
                <ProposalListCard
                  proposal={proposal}
                  govParams={govParams}
                  symbol={symbol}
                />
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
