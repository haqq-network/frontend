'use client';
import { useMemo } from 'react';
import { useChains } from 'wagmi';
import { useWallet } from '@haqq/shell-shared';
import {
  LowBalanceAlert,
  SelectChainModal,
  SelectWalletModal,
} from '@haqq/shell-ui-kit';

export function WalletModals() {
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

  return (
    <>
      <SelectWalletModal
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
