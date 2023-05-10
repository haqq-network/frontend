import { Container, Heading } from '@haqq/ui-kit';
import { ShellIndexPageAccountInfo } from '../account-info/account-info';
import { ShellIndexPageChainStats } from '../chain-stats/chain-stats';
import { ShellIndexPageDelegationList } from '../delegation-list/delegation-list';
import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';
import { MyAccountBlock } from '../../lib/my-account-block/my-account-block';
import { StatisticsBlock } from '../../lib/statistics-block/statistics-block';

export function ShellIndexPage() {
  return (
    <div className="flex flex-col space-y-6">
      <StatisticsBlock />
      <MyAccountBlock />

      <div className="xl:col-span-2 flex flex-col space-y-6">
        {/* <div>
            <Heading level={3} className="mb-4">
              My delegations
            </Heading>
            <ShellIndexPageDelegationList />
          </div> */}
        <section className="w-full px-4 py-8 sm:px-16 sm:py-12 lg:px-20 lg:py-[68px]">
          <div className="mb-[24px] flex flex-row items-center">
            <ProposalsIcon />
            <Heading level={3} className="ml-[8px]">
              Latest proposals
            </Heading>
            <div className="text-[#EC5728] text-[12px] leading-[1.2em] uppercase font-serif font-[600] ml-[16px]">
              Go to Governance
            </div>
          </div>
          <ShellIndexPageProposalList />
        </section>
      </div>
    </div>
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
