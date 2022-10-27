import { useMemo } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { getChainParams } from '../../config';
import { environment } from '../../environments/environment';
import { useOnboarding } from '../../OnboardingContainer';
import { AccountButton } from '../AccountButton/AccountButton';

export function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({
    addressOrName: address,
    watch: true,
  });
  const { disconnect } = useDisconnect();
  const { connectWallet } = useOnboarding();
  const chain = getChainParams(environment.chain);

  const accBalance = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    return {
      value: Number.parseFloat(balance.formatted),
      symbol: chain.nativeCurrency.symbol,
    };
  }, [balance, chain.nativeCurrency.symbol]);

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
