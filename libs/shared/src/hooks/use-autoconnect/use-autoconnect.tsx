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

  // Safe Apps always run inside an iframe. The safe wagmi connector may not
  // be active yet (auto-connect pending) or the user may have connected via
  // a different connector inside the Safe frame — in both cases
  // `wallet_watchAsset` is unusable, so fall back to iframe detection.
  const isInIframe =
    typeof window !== 'undefined' && window.self !== window.top;
  const isSafe = connector?.id === 'safe' || isInIframe;

  // Mobile browsers cannot inject `window.ethereum`, so its presence on a
  // mobile UA means we're inside a dapp browser. If `isMetaMask` is set,
  // we're in MetaMask Mobile's in-app browser — where `wallet_watchAsset`
  // silently fails.
  const isMetaMaskMobile =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    /android|iphone|ipad|ipod/i.test(navigator.userAgent) &&
    Boolean(
      (window as unknown as { ethereum?: { isMetaMask?: boolean } }).ethereum
        ?.isMetaMask,
    );

  return {
    isSafe,
    isMetaMaskMobile,
  };
}
