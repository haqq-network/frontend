import { ProposalListBlock } from '../proposal-list-block/proposal-list-block';
import { MyAccountBlock } from '../my-account-block/my-account-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';
import { DelegationsBlock } from '../delegations-block/delegations-block';
import { useAccount } from 'wagmi';
import { Container } from '@haqq/shell/ui-kit';

export function ShellIndexPage() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col">
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="flex flex-col gap-[8px]">
            <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Shell
            </div>

            <StatisticsBlock />
          </div>
        </Container>
      </div>

      <MyAccountBlock />

      <div className="flex flex-col space-y-[80px] py-[68px]">
        {isConnected && <DelegationsBlock />}
        <ProposalListBlock />
      </div>
    </div>
  );
}
