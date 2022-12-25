import { Card, CardHeading, Container, Heading } from '@haqq/ui-kit';
import { ShellIndexPageAccountInfo } from '../account-info/account-info';
import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';

export function ShellIndexPage() {
  return (
    <Container className="py-10">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col space-y-6">
          <div>
            <Heading level={3} className="mb-4">
              Staking
            </Heading>
            <Card>Validators table</Card>
          </div>
          <div>
            <ShellIndexPageProposalList />
          </div>
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <ShellIndexPageAccountInfo />
          </div>
          <div>
            <Heading level={3} className="mb-4">
              Statistics
            </Heading>
            <Card className="grid grid-cols-2 gap-4">
              <div>
                <CardHeading>Total Staked</CardHeading>
                <div>123</div>
              </div>
              <div className="text-right">
                <CardHeading>Validators</CardHeading>
                <div>123</div>
              </div>
              <div>
                <CardHeading>Peers</CardHeading>
                <div>123</div>
              </div>
              <div className="text-right">
                <CardHeading>Nodes</CardHeading>
                <div>123</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
