import { useMemo } from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { useOnboarding } from '../../OnboardingContainer';
import { AccountButton } from '../AccountButton/AccountButton';

export function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    watch: true,
  });
  const { connectWallet, disconnectWallet } = useOnboarding();
  const { chain } = useNetwork();

  const accBalance = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    return {
      value: Number.parseFloat(balance.formatted),
      symbol: chain?.nativeCurrency.symbol ?? '',
    };
  }, [balance, chain?.nativeCurrency.symbol]);

  const account = useMemo(() => {
    if (!isConnected || !address) {
      return undefined;
    }

    return {
      address,
      balance: accBalance,
    };
  }, [address, accBalance, isConnected]);

  return (
    <AccountButton
      onConnectClick={connectWallet}
      onDisconnectClick={disconnectWallet}
      account={account}
    />
  );
}

export { ConnectButton as default };
