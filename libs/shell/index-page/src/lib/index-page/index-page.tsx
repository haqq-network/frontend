import { ProposalListBlock } from '../proposal-list-block/proposal-list-block';
import { MyAccountBlock } from '../my-account-block/my-account-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';
import { DelegationsBlock } from '../delegations-block/delegations-block';
import { useAccount, useBalance } from 'wagmi';
import {
  AccountButton,
  Button,
  Container,
  LogoutIcon,
} from '@haqq/shell/ui-kit';
import { useMediaQuery } from 'react-responsive';
import { getFormattedAddress, useAddress, useWallet } from '@haqq/shared';
import { useMemo } from 'react';

export function ShellIndexPage() {
  const { isConnected } = useAccount();
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

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

      {isTablet && (
        <div className="sticky bottom-0 left-0 right-0 z-30">
          <AccountFooterMobile />
        </div>
      )}
    </div>
  );
}

function AccountFooterMobile() {
  const { isConnected } = useAccount();
  const { disconnect, openSelectWallet } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: Number.parseFloat(balanceData.formatted),
    };
  }, [balanceData]);

  return (
    <div className="bg-haqq-black transform-gpu bg-opacity-75 backdrop-blur">
      <Container className="py-[16px]">
        {isConnected ? (
          <div className="flex flex-row flex-wrap gap-[12px] min-[375px]:gap-[16px]">
            <div>
              <AccountButton
                balance={balance}
                address={getFormattedAddress(ethAddress, 3, 2)}
                withoutDropdown
              />
            </div>
            <div>
              <Button
                variant={1}
                className="h-[42px] !p-[12px]"
                onClick={disconnect}
              >
                <LogoutIcon className="mt-[-4px]" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button variant={2} onClick={openSelectWallet}>
              Connect wallet
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
