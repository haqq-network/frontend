import {
  ClawbackVestingAccount,
  isClawbackVestingAccount,
} from '@haqq/data-access-cosmos';
import {
  haqqToEth,
  useAccountInfoQuery,
  useIndexerBalanceQuery,
} from '@haqq/shell-shared';
import {
  AccountWidget,
  BalancesFromIndexer,
} from './AccountWidget/AccountWidget';
import { Container } from './Layout/Layout';
import { LiquidVestingHooked } from './liquid-vesting/liquid-vesting';
import { VestingAccountStats } from './vesting-account-stats';
import { PendingPage } from '../pages/pending-page';

export function VestingAccountInfo({
  address,
  isLiquidVestingVisible = false,
}: {
  address: string;
  isLiquidVestingVisible?: boolean;
}) {
  const { data: accountInfo } = useAccountInfoQuery(address);
  const { data: balances } = useIndexerBalanceQuery(address);
  const ethAddress = haqqToEth(address);

  if (!accountInfo || !balances) {
    return <PendingPage />;
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-col space-y-8">
        <AccountWidget
          ethAddress={ethAddress}
          haqqAddress={address}
          balance={balances.total}
        />

        <BalancesFromIndexer
          available={balances.available}
          locked={balances.locked}
          staked={balances.staked}
          vested={balances.vested}
        />

        {isLiquidVestingVisible && (
          <LiquidVestingHooked balance={balances.total} haqqAddress={address} />
        )}

        {isClawbackVestingAccount(accountInfo) && (
          <VestingAccountStats
            accountInfo={accountInfo as ClawbackVestingAccount}
          />
        )}
      </div>
    </Container>
  );
}
