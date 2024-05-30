'use client';
import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useAccount, useBalance } from 'wagmi';
import { getFormattedAddress, useAddress, useWallet } from '@haqq/shell-shared';
import {
  AccountButton,
  Button,
  Container,
  LogoutIcon,
} from '@haqq/shell-ui-kit';

export function AccountFooterMobile() {
  const { isConnected } = useAccount();
  const { disconnect, openSelectWallet } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
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
  const isTablet = useMediaQuery({
    query: `(max-width: 1023px)`,
  });

  if (!isTablet) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30">
      <div className="bg-haqq-black/80 transform-gpu backdrop-blur">
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
    </div>
  );
}
