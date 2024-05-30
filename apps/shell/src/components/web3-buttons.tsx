'use client';
import { Fragment, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBalance, useSwitchNetwork, useNetwork } from 'wagmi';
import {
  useAddress,
  useWallet,
  getFormattedAddress,
  useSupportedChains,
} from '@haqq/shell-shared';
import {
  AccountButton,
  Button,
  SelectChainButton,
  formatNumber,
} from '@haqq/shell-ui-kit';

export function Web3Buttons() {
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { disconnect, openSelectWallet, isNetworkSupported, selectNetwork } =
    useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    chainId: chain.id,
  });

  const router = useRouter();

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: formatNumber(Number.parseFloat(balanceData.formatted)),
    };
  }, [balanceData]);

  const selectChainButtonProps = useMemo(() => {
    return {
      isSupported: isNetworkSupported,
      currentChain: {
        name: chain.name.replace('HAQQ', '').trim() ?? '',
        id: chain.id ?? 0,
      },
      chains: chains.map((chain) => {
        return {
          name: chain.name.replace('HAQQ', '').trim(),
          id: chain.id,
        };
      }),
    };
  }, [chain.id, chain.name, chains, isNetworkSupported]);

  return ethAddress ? (
    <div className="flex flex-row gap-[24px]">
      <SelectChainButton
        {...selectChainButtonProps}
        onChainSelect={async (chainId) => {
          await selectNetwork(chainId);
          router.push('/');
        }}
      />
      <AccountButton
        balance={balance}
        address={getFormattedAddress(ethAddress, 3, 2)}
        onDisconnectClick={disconnect}
      />
    </div>
  ) : (
    <div className="leading-[0]">
      <Button onClick={openSelectWallet}>Connect wallet</Button>
    </div>
  );
}

export function Web3ButtonsMobile() {
  const chains = useSupportedChains();
  const { chain = chains[0] } = useNetwork();
  const { disconnect, openSelectWallet, isNetworkSupported } = useWallet();
  const { ethAddress } = useAddress();
  const { data: balanceData } = useBalance({
    address: ethAddress,
    chainId: chain.id,
  });
  const { switchNetworkAsync } = useSwitchNetwork();
  const router = useRouter();

  const handleChainSelectClick = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
        router.push('/');
      }
    },
    [router, switchNetworkAsync],
  );

  const balance = useMemo(() => {
    if (!balanceData) {
      return undefined;
    }

    return {
      symbol: balanceData.symbol,
      value: formatNumber(Number.parseFloat(balanceData.formatted)),
    };
  }, [balanceData]);

  const selectChainButtonProps = useMemo(() => {
    return {
      isSupported: isNetworkSupported,
      currentChain: {
        name: chain.name.replace('HAQQ', '').trim() ?? '',
        id: chain.id ?? 0,
      },
      chains: chains.map((chain) => {
        return {
          name: chain.name.replace('HAQQ', '').trim(),
          id: chain.id,
        };
      }),
    };
  }, [chain.id, chain.name, chains, isNetworkSupported]);
  return (
    <Fragment>
      {ethAddress && (
        <div className="flex flex-col gap-[24px]">
          <div>
            <SelectChainButton
              {...selectChainButtonProps}
              onChainSelect={handleChainSelectClick}
            />
          </div>
          <AccountButton
            balance={balance}
            address={getFormattedAddress(ethAddress, 3, 2)}
            onDisconnectClick={disconnect}
            withoutDropdown
          />
        </div>
      )}

      <div className="mt-[24px]">
        {ethAddress ? (
          <Button onClick={disconnect}>Disconnect</Button>
        ) : (
          <Button onClick={openSelectWallet}>Connect wallet</Button>
        )}
      </div>
    </Fragment>
  );
}
