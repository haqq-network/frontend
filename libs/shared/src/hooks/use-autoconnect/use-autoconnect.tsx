'use client';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

const AUTOCONNECTED_CONNECTOR_IDS = ['safe'];

export function useWalletAutoConnect() {
  // const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();

  useEffect(() => {
    if (window?.parent === window) {
      return;
    }

    console.log('Available connectors:', connectors);
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connectorId) => {
      const connectorInstance = connectors.find((c) => {
        console.log('Checking connector:', c.id);
        return c.id === connectorId;
      });

      if (connectorInstance) {
        console.log('Attempting to connect with:', connectorInstance.id);
        connectAsync({ connector: connectorInstance })
          .then((data) => {
            console.log('Connected with:', data);
          })
          .catch((error) => {
            console.error('Failed to connect:', error);
          });
      }
    });
  }, [connectAsync, connectors]);
}
