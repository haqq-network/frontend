'use client';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

export function useHaqqWalletAutoConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (!isConnected) {
      const connectorInstance = connectors.find((c) => {
        return c.id === 'injected' && c.name.toLowerCase().includes('haqq');
      });

      if (connectorInstance) {
        connect({ connector: connectorInstance });
      }
    }
  }, [connect, connectors, isConnected]);
}
