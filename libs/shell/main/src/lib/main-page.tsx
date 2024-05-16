'use client';
import dynamic from 'next/dynamic';
import { useWallet } from '@haqq/shell-shared';
import { Container } from '@haqq/shell-ui-kit';
import { ProposalListBlock } from './components/proposal-list-block';
import { StatisticsBlock } from './components/statistics-block';

const DelegationsBlock = dynamic(async () => {
  const { DelegationsBlock } = await import('./components/delegations-block');
  return { default: DelegationsBlock };
});
const AccountFooterMobile = dynamic(async () => {
  const { AccountFooterMobile } = await import(
    './components/account-footer-mobile'
  );
  return { default: AccountFooterMobile };
});
const MyAccountBlock = dynamic(async () => {
  const { MyAccountBlock } = await import('./components/my-account-block');
  return { default: MyAccountBlock };
});

export function MainPage() {
  const { isHaqqWallet } = useWallet();

  return (
    <div className="flex flex-col">
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="flex flex-col gap-[8px]">
            {!isHaqqWallet && (
              <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
                Shell
              </div>
            )}

            <StatisticsBlock />
          </div>
        </Container>
      </div>

      <MyAccountBlock />

      <div className="flex flex-col space-y-[80px] py-[68px]">
        <DelegationsBlock />
        <ProposalListBlock />
      </div>

      <AccountFooterMobile />
    </div>
  );
}
