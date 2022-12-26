import { useMemo } from 'react';
import { getChainParams, useConfig } from '@haqq/shared';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useOnboarding } from '../../OnboardingContainer';
import { AccountButton } from '../AccountButton/AccountButton';

export function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    watch: true,
  });
  const { disconnect } = useDisconnect();
  const { connectWallet } = useOnboarding();
  const { chainName } = useConfig();
  const chainParams = getChainParams(chainName);

  const accBalance = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    return {
      value: Number.parseFloat(balance.formatted),
      symbol: chainParams.nativeCurrency.symbol,
    };
  }, [balance, chainParams.nativeCurrency.symbol]);

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
      onDisconnectClick={disconnect}
      account={account}
    />
  );
}

export { ConnectButton as default };
