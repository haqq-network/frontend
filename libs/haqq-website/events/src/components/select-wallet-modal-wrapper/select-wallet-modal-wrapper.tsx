'use client';
import { PropsWithChildren } from 'react';
import { SelectWalletModal } from '@haqq/haqq-website-ui-kit';
import { useWallet } from '@haqq/shell-shared';

export function SelectWalletModalWrapper({ children }: PropsWithChildren) {
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
    <>
      {children}

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
    </>
  );
}
