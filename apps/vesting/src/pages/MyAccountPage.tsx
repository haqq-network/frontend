import { useEffect, useMemo, useState } from 'react';
import { AccountWidget } from '../components/AccountWidget/AccountWidget';
import { Container } from '../components/Layout/Layout';

import {
  ClawbackVestingAccount,
  useAccountInfoQuery,
  useAddress,
  useCosmosService,
  useSupportedChains,
} from '@haqq/shared';
import { formatUnits } from 'viem';
import { VestingAccountStats } from '../components/VestingAccountStats';
import { Card } from '../components/Card/Card';

export function AccountPage() {
  const { ethAddress, haqqAddress } = useAddress();
  const chains = useSupportedChains();
  const { getBankBalances } = useCosmosService();
  const [balance, setBalance] = useState<undefined | number>(undefined);
  const { data: accountInfo } = useAccountInfoQuery(haqqAddress);

  useEffect(() => {
    (async () => {
      if (haqqAddress) {
        const balances = await getBankBalances(haqqAddress);
        const balance = Number.parseFloat(
          formatUnits(BigInt(balances[0].amount), 18),
        );
        setBalance(balance);
      }
    })();
  }, [haqqAddress, getBankBalances]);

  const accountWidgetProps = useMemo(() => {
    if (!balance || !ethAddress || !haqqAddress) {
      return {
        isConnected: false,
        ethAddress: '',
        haqqAddress: '',
        balance: 0,
        symbol: '',
      };
    }

    return {
      isConnected: true,
      ethAddress: ethAddress,
      haqqAddress: haqqAddress,
      balance,
      symbol: chains[0]?.nativeCurrency.symbol,
    };
  }, [balance, chains, ethAddress, haqqAddress]);

  return (
    <Container className="flex flex-col space-y-12 py-8 sm:py-20">
      <AccountWidget {...accountWidgetProps} />

      {accountInfo &&
        (accountInfo['@type'] === '/haqq.vesting.v1.ClawbackVestingAccount' ? (
          <VestingAccountStats
            accountInfo={accountInfo as ClawbackVestingAccount}
          />
        ) : (
          <Card className="mx-auto w-full max-w-lg overflow-hidden">
            <div className="text-center">This is not vesting account</div>
          </Card>
        ))}
    </Container>
  );
}

export { AccountPage as default };
