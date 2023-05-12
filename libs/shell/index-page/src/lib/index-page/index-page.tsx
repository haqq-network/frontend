import { ProposalListBlock } from '../proposal-list-block/proposal-list-block';
import { MyAccountBlock } from '../my-account-block/my-account-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';
import { DelegationsBlock } from '../delegations-block/delegations-block';
import { useAccount } from 'wagmi';

export function ShellIndexPage() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col">
      <section className="flex w-full px-4 py-8 sm:px-16 sm:py-12 lg:px-20 lg:py-[68px]">
        <div className="flex flex-col space-y-[12px]">
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Shell
          </div>

          <StatisticsBlock />
        </div>
      </section>

      <MyAccountBlock />

      <div className="flex flex-col space-y-[80px] py-[80px]">
        {isConnected && <DelegationsBlock />}
        <ProposalListBlock />
      </div>
    </div>
  );
}
