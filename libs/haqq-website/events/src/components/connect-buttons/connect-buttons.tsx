'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import {
  useAddress,
  useWallet,
  getFormattedAddress,
  useSupportedChains,
} from '@haqq/shared';
import { AccountButton, Button, SelectChainButton } from '@haqq/shell-ui-kit';

export function ConnectButtons() {
  const { chain } = useNetwork();
  const chains = useSupportedChains();
  const { disconnect, openSelectWallet } = useWallet();
  const { ethAddress } = useAddress();
  const [isMounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration warning hack
  if (!isMounted) {
    return null;
  }

  return (
    <div>
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
