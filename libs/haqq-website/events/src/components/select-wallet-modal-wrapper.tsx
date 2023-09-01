'use client';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { SelectWalletModal } from '@haqq/shell-ui-kit';
import { useConnect } from 'wagmi';
import { useWallet } from '@haqq/shared';

export function SelectWalletModalWrapper({ children }: PropsWithChildren) {
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { closeSelectWallet, isSelectWalletOpen } = useWallet();

  const handleWalletConnect = useCallback(
    async (connectorIdx: number) => {
      await connectAsync({ connector: connectors[connectorIdx] });
      closeSelectWallet();
    },
    [closeSelectWallet, connectAsync, connectors],
  );

  const selectWalletModalConnectors = useMemo(() => {
    return connectors.map((connector, index) => {
      return {
        id: index,
        name: connector.name,
        isPending: isLoading && pendingConnector?.id === connector.id,
      };
    });
  }, [connectors, isLoading, pendingConnector?.id]);

  return (
    <>
      {children}

      <SelectWalletModal
        isOpen={isSelectWalletOpen}
        connectors={selectWalletModalConnectors}
        error={error?.message}
        onConnectClick={handleWalletConnect}
        onClose={closeSelectWallet}
      />
    </>
  );
}
