'use client';
import { useMemo } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAccount, useChains } from 'wagmi';
import { haqqMainnet, haqqTestedge2 } from 'wagmi/chains';
import {
  getFormattedAddress,
  useAddress,
  useIndexerBalanceQuery,
  useWallet,
} from '@haqq/shell-shared';
import { Button, AccountButton, SelectChainButton } from '@haqq/shell-ui-kit';
import { formatNumber } from '@haqq/shell-ui-kit/server';

function useChainArray() {
  const chains = useChains();

  return useMemo(() => {
    if (chains.length === 0) {
      return [
        {
          id: haqqMainnet.id,
          name: haqqMainnet.name,
        },
        {
          id: haqqTestedge2.id,
          name: haqqTestedge2.name,
        },
      ];
    }

    return chains.map((chain) => {
      return {
        id: chain.id,
        name: chain.name,
      };
    });
  }, [chains]);
}

export function Web3ConnectButtons() {
  const { t } = useTranslate('common');
  const { isConnected, chain } = useAccount();
  const { haqqAddress, ethAddress } = useAddress();
  const { openSelectWallet, disconnect, selectNetwork } = useWallet();
  const { data: balance } = useIndexerBalanceQuery(haqqAddress);
  const chainArray = useChainArray();
  console.log({ balance });

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
    <div className="flex flex-row gap-[24px]">
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
        />
      </div>
      <div className="leading-[0]">
        <AccountButton
          balance={balance ? formatNumber(balance.balance) : undefined}
          address={getFormattedAddress(ethAddress, 3, 2)}
          onDisconnectClick={disconnect}
        />
      </div>
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
      <div className="leading-[0]">
        <AccountButton
          balance={balance ? formatNumber(balance.balance) : undefined}
          address={getFormattedAddress(ethAddress, 3, 2)}
          withoutDropdown
        />
      </div>
      <div className="leading-[0]">
        <Button onClick={disconnect}>{t('disconnect', 'Disconnect')}</Button>
      </div>
    </div>
  );
}
