import { Container, Heading } from '@haqq/ui-kit';
import { ShellIndexPageAccountInfo } from '../account-info/account-info';
import { ShellIndexPageChainStats } from '../chain-stats/chain-stats';
import { ShellIndexPageDelegationList } from '../delegation-list/delegation-list';
import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';

export function ShellIndexPage() {
  return (
    <Container className="py-10">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col space-y-6">
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
        <div className="flex flex-col space-y-6">
          <div>
            <Heading level={3} className="mb-4">
              My account
            </Heading>
            <ShellIndexPageAccountInfo />
          </div>
          <div>
            <Heading level={3} className="mb-4">
              Chain stats
            </Heading>
            <ShellIndexPageChainStats />
          </div>
        </div>
      </div>
    </Container>
  );
}
