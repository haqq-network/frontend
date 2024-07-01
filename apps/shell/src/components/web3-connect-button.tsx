'use client';
import { useAccount, useChains } from 'wagmi';
import {
  getFormattedAddress,
  useAddress,
  useIndexerBalanceQuery,
  useWallet,
} from '@haqq/shell-shared';
import { Button, AccountButton, SelectChainButton } from '@haqq/shell-ui-kit';
import { formatNumber } from '@haqq/shell-ui-kit/server';

export function Web3ConnectButtons() {
  const { isConnected, chain } = useAccount();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useChains();
  const { openSelectWallet, disconnect, selectNetwork } = useWallet();
  const { data: balance } = useIndexerBalanceQuery(haqqAddress);

  if (!isConnected || !ethAddress) {
    return (
      <div className="leading-[0]">
        <Button onClick={openSelectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  const chainArray = chains.map((chain) => {
    return {
      id: chain.id,
      name: chain.name,
      // name: chain.name.replace('HAQQ', '').trim(),
    };
  });

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
  const { isConnected, chain } = useAccount();
  const { haqqAddress, ethAddress } = useAddress();
  const chains = useChains();
  const { openSelectWallet, disconnect, selectNetwork } = useWallet();
  const { data: balance } = useIndexerBalanceQuery(haqqAddress);

  if (!isConnected || !ethAddress) {
    return (
      <div className="leading-[0]">
        <Button onClick={openSelectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  const chainArray = chains.map((chain) => {
    return {
      id: chain.id,
      name: chain.name,
      // name: chain.name.replace('HAQQ', '').trim(),
    };
  });

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
          dropdownClassName="right-auto left-[0px]"
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
        <Button onClick={disconnect}>Disconnect</Button>
      </div>
    </div>
  );
}
