'use client';
import { useMemo } from 'react';
import { useChains } from 'wagmi';
import { useDeeplink, useWallet } from '@haqq/shell-shared';
import {
  LowBalanceAlert,
  SelectChainModal,
  SelectWalletModal,
} from '@haqq/shell-ui-kit';

export function WalletModals({ isMobileUA }: { isMobileUA: boolean }) {
  const {
    connectors,
    connect,
    availableConnectors,
    closeSelectWallet,
    connectError,
    setConnectError,
    isSelectWalletOpen,
    selectNetwork,
    isSelectChainOpen,
    closeSelectChain,
    isLowBalanceAlertOpen,
    closeLowBalanceAlert,
    isHaqqWallet,
  } = useWallet();
  const supportedChains = useChains();

  const chains = useMemo(() => {
    return supportedChains.map((chain) => {
      return {
        id: chain.id,
        name: chain.name,
      };
    });
  }, [supportedChains]);

  const deeplink = useDeeplink();

  return (
    <>
      <SelectWalletModal
        isMobileUA={isMobileUA}
        connectors={connectors}
        onConnectClick={async (connectorId: number) => {
          try {
            await connect({ connector: availableConnectors[connectorId] });
            closeSelectWallet();
          } catch (error: unknown) {
            setConnectError((error as Error).message);
          }
        }}
        isOpen={isSelectWalletOpen}
        onClose={closeSelectWallet}
        error={connectError ?? ''}
        deeplink={deeplink}
        isHaqqWallet={isHaqqWallet}
      />

      <SelectChainModal
        isOpen={isSelectChainOpen}
        chains={chains}
        onChainSelect={selectNetwork}
        onClose={closeSelectChain}
      />

      <LowBalanceAlert
        isOpen={isLowBalanceAlertOpen}
        onClose={closeLowBalanceAlert}
      />
    </>
  );
}
