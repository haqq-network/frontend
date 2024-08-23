import { lazy } from 'react';
import { useWallet } from '@haqq/shell-shared';

const SelectWalletModal = lazy(async () => {
  const { SelectWalletModal } = await import(
    '../components/select-wallet-modal'
  );
  return { default: SelectWalletModal };
});

export function WalletModals() {
  const {
    connectors,
    connect,
    availableConnectors,
    closeSelectWallet,
    connectError,
    setConnectError,
    isSelectWalletOpen,
  } = useWallet();

  return (
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
  );
}
