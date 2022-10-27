import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { AccountWidget } from '../components/AccountWidget/AccountWidget';
import { DepositStatsWidget } from '../components/DepositStatsWidget/DepositStatsWidget';
import { Container } from '../components/Layout/Layout';
import { getChainParams } from '../config';
import { environment } from '../environments/environment';

export function AccountPage() {
  const { address, isConnected } = useAccount();
  const {
    data: balance,
    // isError,
    // isLoading,
    // status,
    // error,
  } = useBalance({
    addressOrName: address,
    watch: true,
  });
  const chain = getChainParams(environment.chain);

  const accountWidgetProps = useMemo(() => {
    return {
      isConnected,
      address: address ?? '',
      balance: balance ? Number.parseFloat(balance.formatted) : 0,
      symbol: chain.nativeCurrency.symbol,
    };
  }, [address, balance, chain.nativeCurrency.symbol, isConnected]);

  return (
    <Container className="flex flex-col space-y-12 py-8 sm:py-20">
      <AccountWidget {...accountWidgetProps} />

      {environment.contractAddress && (
        <DepositStatsWidget contractAddress={environment.contractAddress} />
      )}
    </Container>
  );
}

export { AccountPage as default };
