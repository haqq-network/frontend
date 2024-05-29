import { useAccount } from 'wagmi';
import {
  getFormattedAddress,
  useAddress,
  useIndexerBalanceQuery,
  useWallet,
} from '@haqq/shell-shared';
import { Button, AccountButton } from '@haqq/shell-ui-kit';
import { Container, LogoutIcon } from '@haqq/shell-ui-kit/server';

export function AccountFooterMobile() {
  const { isConnected } = useAccount();
  const { disconnect, openSelectWallet } = useWallet();
  const { haqqAddress, ethAddress } = useAddress();
  const { data: balances } = useIndexerBalanceQuery(haqqAddress);

  return (
    <div className="bg-haqq-black transform-gpu bg-opacity-75 backdrop-blur">
      <Container className="py-[16px]">
        {isConnected ? (
          <div className="flex flex-row flex-wrap gap-[12px] min-[375px]:gap-[16px]">
            <div>
              <AccountButton
                balance={balances?.available}
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
