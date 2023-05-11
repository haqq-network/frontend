import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';
import { MyAccountBlock } from '../../lib/my-account-block/my-account-block';
import { StatisticsBlock } from '../../lib/statistics-block/statistics-block';

export function ShellIndexPage() {
  return (
    <div className="flex flex-col space-y-6">
      <StatisticsBlock />
      <MyAccountBlock />
      <ShellIndexPageProposalList />
    </div>
  );
}
