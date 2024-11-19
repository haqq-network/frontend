'use client';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

const AUTOCONNECTED_CONNECTOR_IDS = ['safe', 'haqq'];

export function useAutoconnect() {
  const { connectAsync, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (window?.parent === window) {
      return;
    }

    if (isConnected) {
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
  }, [connectAsync, connectors, isConnected]);
}

export function useConnectorType() {
  const { connector } = useAccount();

  return {
    isSafe: connector?.id === 'safe',
  };
}
