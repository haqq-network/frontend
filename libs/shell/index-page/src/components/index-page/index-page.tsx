import { ShellIndexPageProposalList } from '../proposal-list/proposal-list';
import { MyAccountBlock } from '../my-account-block/my-account-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';

export function ShellIndexPage() {
  return (
    <div className="flex flex-col space-y-6">
      <StatisticsBlock />
      <MyAccountBlock />
      <ShellIndexPageProposalList />
    </div>
  );
}
