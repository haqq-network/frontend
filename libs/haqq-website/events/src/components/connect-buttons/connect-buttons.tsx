'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useChains, useSwitchChain } from 'wagmi';
import { useAddress, useWallet, getFormattedAddress } from '@haqq/shell-shared';
import { AccountButton, Button, SelectChainButton } from '@haqq/shell-ui-kit';

export function ConnectButtons() {
  const chains = useChains();
  const { chain = chains[0] } = useAccount();
  const { disconnect, openSelectWallet } = useWallet();
  const { ethAddress } = useAddress();
  const [isMounted, setMounted] = useState(false);
  const { switchChainAsync } = useSwitchChain();

  const handleChainSelectClick = useCallback(
    async (chainId: number) => {
      if (switchChainAsync) {
        await switchChainAsync({ chainId });
      }
    },
    [switchChainAsync],
  );

  const selectChainButtonProps = useMemo(() => {
    return {
      isSupported: Boolean(chain),
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
