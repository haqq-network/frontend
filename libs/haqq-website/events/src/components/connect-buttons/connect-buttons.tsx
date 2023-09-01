'use client';
import { useCallback, useMemo } from 'react';
import { AccountButton, Button, SelectChainButton } from '@haqq/shell-ui-kit';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import {
  useAddress,
  useWallet,
  getFormattedAddress,
  useSupportedChains,
} from '@haqq/shared';

export function ConnectButtons() {
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const { disconnect, openSelectWallet } = useWallet();
  const { ethAddress } = useAddress();

  const { switchNetworkAsync } = useSwitchNetwork();

  const handleChainSelectClick = useCallback(
    async (chainId: number) => {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
      }
    },
    [switchNetworkAsync],
  );

  const selectChainButtonProps = useMemo(() => {
    return {
      isSupported: Boolean(
        chain && chain?.unsupported !== undefined && !chain.unsupported,
      ),
      currentChain: {
        name: chain?.name.replace('HAQQ', '').trim() ?? '',
        id: chain?.id ?? 0,
      },
      chains: chains.map((chain) => {
        return {
          name: chain.name.replace('HAQQ', '').trim(),
          id: chain.id,
        };
      }),
    };
  }, [chain, chains]);

  return (
    <div className="hidden pl-[80px] lg:block">
      {ethAddress ? (
        <div className="flex flex-row gap-[24px]">
          <SelectChainButton
            {...selectChainButtonProps}
            onChainSelect={handleChainSelectClick}
          />
          <AccountButton
            address={getFormattedAddress(ethAddress, 3, 2)}
            onDisconnectClick={disconnect}
          />
        </div>
      ) : (
        <Button onClick={openSelectWallet}>Connect wallet</Button>
      )}
    </div>
  );
}
