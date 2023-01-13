import { Fragment, useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { AccountWidget } from '../components/AccountWidget/AccountWidget';
import { DepositStatsWidget } from '../components/DepositStatsWidget/DepositStatsWidget';
import { Container } from '../components/Layout/Layout';
import { environment } from '../environments/environment';
import { getChainParams, useAddress, useConfig } from '@haqq/shared';
import { DepositWithdrawalList } from '../components/DepositWithdrawalList/DepositWithdrawalList';

export function AccountPage() {
  const { isConnected } = useAccount();
  const { ethAddress, haqqAddress } = useAddress();
  const { data: balance } = useBalance({
    address: ethAddress,
    watch: true,
  });
  const { chainName } = useConfig();
  const chain = getChainParams(chainName);

  const accountWidgetProps = useMemo(() => {
    return {
      isConnected,
      ethAddress: ethAddress ?? '',
      haqqAddress: haqqAddress ?? '',
      balance: balance ? Number.parseFloat(balance.formatted) : 0,
      symbol: chain.nativeCurrency.symbol,
    };
  }, [
    balance,
    chain.nativeCurrency.symbol,
    ethAddress,
    haqqAddress,
    isConnected,
  ]);

  return (
    <Container className="flex flex-col space-y-12 py-8 sm:py-20">
      <AccountWidget {...accountWidgetProps} />

      {environment.contractAddress && ethAddress && (
        <Fragment>
          <DepositStatsWidget contractAddress={environment.contractAddress} />
          <DepositWithdrawalList
            contractAddress={environment.contractAddress}
            address={ethAddress}
          />
        </Fragment>
      )}
    </Container>
  );
}

export { AccountPage as default };
