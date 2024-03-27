'use client';
import { useEffect } from 'react';
import { useConnect } from 'wagmi';

export function useHaqqWalletAutoConnect() {
  const { connect, connectors } = useConnect();

  useEffect(() => {
    const connectorInstance = connectors.find((c) => {
      return c.id === 'injected' && c.name.toLowerCase().includes('haqq');
    });

    if (connectorInstance) {
      connect({ connector: connectorInstance });
    }
  }, [connect, connectors]);
}
