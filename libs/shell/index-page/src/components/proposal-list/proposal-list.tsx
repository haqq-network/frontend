import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerLoader } from '@haqq/ui-kit';
import { ProposalListCard } from '@haqq/governance/proposal-list';
import { useProposalListQuery } from '@haqq/shared';
import { Heading } from '@haqq/website/ui-kit';
import { OrangeLink } from '@haqq/shell/ui-kit-next';

export function ShellIndexPageProposalList() {
  const { data: proposalsData, isFetching } = useProposalListQuery();
  const proposals = useMemo(() => {
    if (!proposalsData?.length) {
      return [];
    }

    return proposalsData.slice(0, 10);
  }, [proposalsData]);

  return (
    <section className="w-full px-[16px] sm:px-[63px] lg:px-[79px] lg:py-[68px]">
      <div className="mb-[24px] flex flex-row items-center">
        <ProposalsIcon />
        <Heading level={3} className="ml-[8px]">
          Latest proposals
        </Heading>
        <OrangeLink
          href="/governance"
          className="ml-[16px] uppercase font-serif !text-[12px]"
        >
          Go to Governance
        </OrangeLink>
      </div>
      {!isFetching ? (
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
      ) : (
        <div className="flex-1 flex flex-col space-y-8 items-center justify-center min-h-full select-none pointer-events-none py-[48px]">
          <SpinnerLoader className="text-white/10 !fill-haqq-orange w-10 h-10" />
          <div className="font-sans text-[10px] leading-[1.2em] uppercase">
            Fetching proposals
          </div>
        </div>
      )}
    </section>
  );
}

function ProposalsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 2.5C5 1.94772 5.44772 1.5 6 1.5H18C18.5523 1.5 19 1.94772 19 2.5V11.5H21C21.5523 11.5 22 11.9477 22 12.5V21.5C22 22.0523 21.5523 22.5 21 22.5H3C2.44772 22.5 2 22.0523 2 21.5V12.5C2 11.9477 2.44772 11.5 3 11.5H5V2.5ZM5 17.5H19V13.5H20V20.5H4V13.5H5V17.5ZM7 3.5V15.5H17V3.5H7ZM10.9544 12.3686L15.6585 8.25258L14.3415 6.74742L11.0456 9.63136L9.70711 8.29289L8.29289 9.70711L10.9544 12.3686Z"
        fill="currentColor"
      />
    </svg>
  );
}
