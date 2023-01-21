import { Container, Heading } from '@haqq/ui-kit';
import { ShellIndexPageAccountInfo } from '../account-info/account-info';
import { ShellIndexPageChainStats } from '../chain-stats/chain-stats';
import { ShellIndexPageDelegationList } from '../delegation-list/delegation-list';
import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';
import { MyAccountBlock, StatisticsBlock } from '@haqq/shell/index-page';

export function ShellIndexPage() {
  return (
    <Container>
      <div className="flex flex-col space-y-6">
        <StatisticsBlock />
        <MyAccountBlock />
        <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-0 space-y-6">
          <div className="md:flex-1 flex flex-col">
            <Heading level={3} className="mb-4">
              My account
            </Heading>
            <ShellIndexPageAccountInfo />
          </div>
          <div className="md:flex-1 flex flex-col">
            <Heading level={3} className="mb-4">
              Chain stats
            </Heading>
            <ShellIndexPageChainStats />
          </div>
        </div>
        <div className="xl:col-span-2 flex flex-col space-y-6">
          <div>
            <Heading level={3} className="mb-4">
              My delegations
            </Heading>
            <ShellIndexPageDelegationList />
          </div>
          <div>
            <Heading level={3} className="mb-4">
              Latest proposals
            </Heading>
            <ShellIndexPageProposalList />
          </div>
        </div>
      </div>
    </Container>
  );
}
