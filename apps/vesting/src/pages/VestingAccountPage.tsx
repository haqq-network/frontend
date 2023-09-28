import { Fragment, useEffect, useMemo, useState } from 'react';
import { AccountWidget } from '../components/AccountWidget/AccountWidget';
import { Container } from '../components/Layout/Layout';
import { Navigate, useParams } from 'react-router-dom';
import { formatUnits, isAddress } from 'viem';
import {
  ethToHaqq,
  haqqToEth,
  useSupportedChains,
  useCosmosService,
  useAccountInfoQuery,
  ClawbackVestingAccount,
} from '@haqq/shared';
import { VestingAccountStats } from '../components/VestingAccountStats';

export function VestingAccountPage() {
  const { address } = useParams();
  const chains = useSupportedChains();
  const { getBankBalances } = useCosmosService();
  const [balance, setBalance] = useState<undefined | number>(undefined);
  const [accountAddress, setAccountAddress] = useState<
    { eth: string; haqq: string } | undefined
  >(undefined);

  const { data: accountInfo } = useAccountInfoQuery(accountAddress?.haqq);

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

  useEffect(() => {
    (async () => {
      if (accountAddress?.haqq) {
        const balances = await getBankBalances(accountAddress.haqq);
        const balance = Number.parseFloat(
          formatUnits(BigInt(balances[0].amount), 18),
        );
        setBalance(balance);
      }
    })();
  }, [accountAddress, getBankBalances]);

  const accountWidgetProps = useMemo(() => {
    if (!balance) {
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
      ethAddress: accountAddress?.eth ?? '',
      haqqAddress: accountAddress?.haqq ?? '',
      balance,
      symbol: chains[0]?.nativeCurrency.symbol,
    };
  }, [accountAddress?.eth, accountAddress?.haqq, balance, chains]);

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }
  return (
    <Container className="flex flex-col space-y-12 py-8 sm:py-20">
      <AccountWidget {...accountWidgetProps} />

      {accountInfo && (
        <Fragment>
          {accountInfo['@type'] ===
          '/haqq.vesting.v1.ClawbackVestingAccount' ? (
            <VestingAccountStats
              accountInfo={accountInfo as ClawbackVestingAccount}
            />
          ) : (
            <div>This is not vesting account</div>
          )}
        </Fragment>
      )}
    </Container>
  );
}

export { VestingAccountPage as default };
