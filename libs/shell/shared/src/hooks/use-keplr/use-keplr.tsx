import { Keplr } from '@keplr-wallet/types';
import type { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export const getKeplrWallet = async (): Promise<Keplr | undefined> => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        console.log('getKeplrWallet', {
          version: window?.keplr?.version,
        });
        document.removeEventListener('readystatechange', documentStateChange);
        resolve(window.keplr);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
