import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isAddress } from 'viem';
import {
  ethToHaqq,
  haqqToEth,
  useAccountInfoQuery,
  ClawbackVestingAccount,
} from '@haqq/shared';
import { PendingPage } from './PendingPage';
import {
  AccountWidget,
  BalancesFromIndexer,
} from '../components/AccountWidget/AccountWidget';
import { Container } from '../components/Layout/Layout';
import { VestingAccountStats } from '../components/VestingAccountStats';
import {
  IndexerBalances,
  useIndexerBalances,
} from '../hooks/use-indexer-balances';

export function AccountPage() {
  const { address } = useParams();
  const [accountAddress, setAccountAddress] = useState<
    { eth: string; haqq: string } | undefined
  >(undefined);

  useEffect(() => {
    if (address) {
      if (address.startsWith('0x')) {
        const isValidEthAddress = isAddress(address);

        if (isValidEthAddress) {
          const haqq = ethToHaqq(address);
          setAccountAddress({
            eth: address,
            haqq,
          });
        }
      } else if (address.startsWith('haqq1')) {
        const eth = haqqToEth(address);
        const isValidEthAddress = isAddress(eth);
        if (isValidEthAddress) {
          setAccountAddress({
            eth,
            haqq: address,
          });
        }
      }
    }
  }, [address]);

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  if (!accountAddress) {
    return <PendingPage />;
  }

  return (
    <AccountPageComponent
      ethAddress={accountAddress.eth}
      haqqAddress={accountAddress.haqq}
    />
  );
}

export function AccountPageComponent({
  ethAddress,
  haqqAddress,
}: {
  ethAddress: string;
  haqqAddress: string;
}) {
  const { data: accountInfo } = useAccountInfoQuery(haqqAddress);
  const { getBalances } = useIndexerBalances();
  const [balances, setBalances] = useState<IndexerBalances | undefined>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const balancesResponse = await getBalances(haqqAddress);
      setBalances(balancesResponse);
    })();
  }, [getBalances, haqqAddress]);

  if (!balances) {
    return <PendingPage />;
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-col space-y-8">
        <AccountWidget
          ethAddress={ethAddress}
          haqqAddress={haqqAddress}
          balance={balances.total}
        />
        <BalancesFromIndexer
          available={balances.available}
          locked={balances.locked}
          staked={balances.staked}
          vested={balances.vested}
        />
        {accountInfo &&
          accountInfo['@type'] ===
            '/haqq.vesting.v1.ClawbackVestingAccount' && (
            <VestingAccountStats
              accountInfo={accountInfo as ClawbackVestingAccount}
            />
          )}
      </div>
    </Container>
  );
}

export { AccountPage as default };
