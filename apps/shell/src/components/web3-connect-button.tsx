'use client';
import { useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import { usePathname } from 'next/navigation';
import { useAccount, useChains } from 'wagmi';
import {
  getFormattedAddress,
  useAddress,
  useIndexerBalanceQuery,
  useWallet,
} from '@haqq/shell-shared';
import { Button, AccountButton, SelectChainButton } from '@haqq/shell-ui-kit';
import { formatNumber } from '@haqq/shell-ui-kit/server';
import {
  baseSupportedChains,
  bridgeSupportedChains,
} from '../config/wagmi-config';

function useIsBridgePage() {
  const pathname = usePathname();
  return useMemo(() => {
    return pathname?.startsWith('/bridge');
  }, [pathname]);
}

function useChainArray() {
  const chains = useChains();
  const isBridgePage = useIsBridgePage();

  return useMemo(() => {
    const availableChains = isBridgePage
      ? bridgeSupportedChains
      : baseSupportedChains;

    if (chains.length === 0) {
      return availableChains.map((chain) => {
        return {
          id: chain.id,
          name: chain.name,
        };
      });
    }

    return (isBridgePage ? bridgeSupportedChains : availableChains).map(
      (chain) => {
        return {
          id: chain.id,
          name: chain.name,
        };
      },
    );
  }, [chains, isBridgePage]);
}

export function Web3ConnectButtons() {
  const { t } = useTranslate('common');
  const { isConnected, chain } = useAccount();
  const { haqqAddress, ethAddress } = useAddress();
  const { openSelectWallet, disconnect, selectNetwork } = useWallet();
  const { data: balance } = useIndexerBalanceQuery(haqqAddress);
  const chainArray = useChainArray();
  const isBridgePage = useIsBridgePage();

  if (!isConnected || !ethAddress) {
    return (
      <div className="leading-[0]">
        <Button onClick={openSelectWallet}>
          {t('connect-wallet-button', 'Connect Wallet')}
        </Button>
      </div>
    );
  }

  const isSupported =
    chain !== undefined &&
    chainArray.some((itemChain) => {
      return chain.id === itemChain.id;
    });

  return (
    <div className="flex flex-row gap-[24px]">
      <div className="leading-[0]">
        <SelectChainButton
          isSupported={isSupported}
          currentChain={
            chain
              ? {
                  id: chain.id,
                  name: chain.name.replace('HAQQ', '').trim(),
                }
              : undefined
          }
          onChainSelect={(chainId) => {
            selectNetwork(chainId);
          }}
          chains={chainArray}
        />
      </div>
      {!isBridgePage && (
        <div className="leading-[0]">
          <AccountButton
            balance={balance ? formatNumber(balance.balance) : undefined}
            address={getFormattedAddress(ethAddress, 3, 2)}
            onDisconnectClick={disconnect}
          />
        </div>
      )}
    </div>
  );
}

export function Web3ConnectButtonsMobile() {
  const { t } = useTranslate('common');
  const { isConnected, chain } = useAccount();
  const { haqqAddress, ethAddress } = useAddress();
  const { openSelectWallet, disconnect, selectNetwork } = useWallet();
  const { data: balance } = useIndexerBalanceQuery(haqqAddress);
  const chainArray = useChainArray();

  const isBridgePage = useIsBridgePage();

  if (!isConnected || !ethAddress) {
    return (
      <div className="leading-[0]">
        <Button onClick={openSelectWallet}>
          {t('connect-wallet-button', 'Connect Wallet')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="leading-[0]">
        <SelectChainButton
          isSupported={chain !== undefined}
          currentChain={
            chain
              ? {
                  id: chain.id,
                  name: chain.name.replace('HAQQ', '').trim(),
                }
              : undefined
          }
          onChainSelect={(chainId) => {
            selectNetwork(chainId);
          }}
          chains={chainArray}
          dropdownClassName="end-auto start-0"
        />
      </div>
      {!isBridgePage && (
        <div className="leading-[0]">
          <AccountButton
            balance={balance ? formatNumber(balance.balance) : undefined}
            address={getFormattedAddress(ethAddress, 3, 2)}
            withoutDropdown
          />
        </div>
      )}
      <div className="leading-[0]">
        <Button onClick={disconnect}>{t('disconnect', 'Disconnect')}</Button>
      </div>
    </div>
  );
}
