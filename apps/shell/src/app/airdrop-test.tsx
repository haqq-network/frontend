import { Button, Container } from '@haqq/shell-ui-kit';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';
import { useCallback, useState } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export function AirdropTestPage() {
  const [accounts, setAccounts] = useState<Record<string, string>>({});

  const getKeplrWallet = useCallback(async (): Promise<Keplr | undefined> => {
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
          resolve(window.keplr);
          console.log('getKeplrWallet', {
            version: window?.keplr?.version,
          });
          document.removeEventListener('readystatechange', documentStateChange);
        }
      };

      document.addEventListener('readystatechange', documentStateChange);
    });
  }, []);

  const connectKeplrWallet = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();

    if (keplrWallet) {
      await keplrWallet.enable(['haqq_54211-3', 'osmosis-1', 'evmos_9001-2']);

      const [haqq, osmosis, evmos] = await Promise.all([
        await keplrWallet.getKey('haqq_54211-3'),
        await keplrWallet.getKey('osmosis-1'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      console.log({ haqq, osmosis, evmos });

      setAccounts({
        haqq: haqq.bech32Address,
        osmosis: osmosis.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [getKeplrWallet]);

  const keplrSignDirect = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();

    if (keplrWallet) {
      const { bech32Address: osmisisAddress } = await keplrWallet.getKey(
        'osmosis-1',
      );

      const signature = await keplrWallet?.signDirect(
        'osmosis-1',
        osmisisAddress,
        {
          chainId: 'osmosis-1',
          bodyBytes: new Uint8Array([]),
          authInfoBytes: new Uint8Array([]),
          // accountNumber:
        },
      );
      console.log({ signature });
    }
  }, [getKeplrWallet]);

  const keplrSignArbitrary = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();
    if (keplrWallet) {
      const { bech32Address: osmisisAddress } = await keplrWallet.getKey(
        'osmosis-1',
      );
      const signature = await keplrWallet?.signArbitrary(
        'osmosis-1',
        osmisisAddress,
        'hello',
      );
      console.log({ signature });
    }
  }, [getKeplrWallet]);

  const isSignAvailable = Object.keys(accounts).length === 0;

  return (
    <Container>
      <div className="flex flex-col divide-y">
        <div className="flex flex-row gap-6 py-10">
          <Button onClick={connectKeplrWallet}>Connect wallet</Button>
          <Button onClick={keplrSignDirect} disabled={isSignAvailable}>
            signDirect osmosis-1
          </Button>
          <Button onClick={keplrSignArbitrary} disabled={isSignAvailable}>
            signArbitrary osmosis-1
          </Button>
        </div>
        <div className="py-10">
          <pre>{JSON.stringify(accounts, null, 2)}</pre>
        </div>
      </div>
    </Container>
  );
}
