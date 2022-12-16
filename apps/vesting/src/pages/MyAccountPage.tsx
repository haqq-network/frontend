import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { AccountWidget } from '../components/AccountWidget/AccountWidget';
import { DepositStatsWidget } from '../components/DepositStatsWidget/DepositStatsWidget';
import { Container } from '../components/Layout/Layout';
import { useAddress } from '@haqq/hooks';
import { useConfig } from '@haqq/providers';
import { environment } from '../environments/environment';
import { getChainParams } from '@haqq/shared';

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

      {environment.contractAddress && (
        <DepositStatsWidget contractAddress={environment.contractAddress} />
      )}
    </Container>
  );
}

export { AccountPage as default };
