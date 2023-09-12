import { Button, Container } from '@haqq/shell-ui-kit';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';
import { useCallback, useState } from 'react';
import { ecrecover, fromRpcSig } from '@ethereumjs/util';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export function signatureToPubkey(signature: string, msgHash: Buffer) {
  const ret = fromRpcSig(signature);
  return ecrecover(msgHash, ret.v, ret.r, ret.s);
}

export function AirdropTestPage() {
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [signature, setSignature] = useState<any>();

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

  const keplrSignArbitraryOsmosis = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();

    if (keplrWallet) {
      const { bech32Address: osmisisAddress } = await keplrWallet.getKey(
        'evmos_9001-2',
      );

      const signature = await keplrWallet?.signDirect(
        'evmos_9001-2',
        osmisisAddress,
        {
          chainId: 'evmos_9001-2',
          bodyBytes: new Uint8Array([]),
          authInfoBytes: new Uint8Array([]),
          // accountNumber:
        },
      );
      console.log({ signature });

      setSignature(signature);
    }
  }, [getKeplrWallet]);

  const keplrSignArbitrary = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();
    if (keplrWallet) {

      const chainId = 'osmosis-1'; // evmos_9001-2, osmosis-1, haqq_11235-1

      const { bech32Address } = await keplrWallet.getKey(
        chainId,
      );

      const MSG = 'hello';
      const signatureArb = await keplrWallet?.signArbitrary(
        chainId,
        bech32Address,
        MSG,
      );

      console.log({ bech32Address })
      console.log({ message: MSG })
      console.log({ signatureArb: btoa(JSON.stringify(signatureArb)) });

      /*
        // Compare signature
      const signatureToCompare = `0x${Buffer.from(
          signatureArb.signature,
          'base64',
      ).toString('hex')}`

      const hexMsg = Buffer.from(
          MSG,
          'base64',
      )

      const pubkeyComputed = signatureToPubkey(
        signatureToCompare,
        hexMsg,
      )

      console.log(signatureToCompare, pubkeyComputed.toString('utf-8'))
*/
      setSignature(signatureArb);
    }
  }, [getKeplrWallet]);

  const isSignAvailable = Object.keys(accounts).length === 0;

  return (
    <Container>
      <div className="flex flex-col divide-y">
        <div className="flex flex-row gap-6 py-10">
          <Button onClick={connectKeplrWallet}>Connect wallet</Button>
          <Button onClick={keplrSignArbitrary} disabled={isSignAvailable}>
            signArbitrary haqq_11235-1
          </Button>
          {/* <Button onClick={keplrSignArbitrary("osmosis-1")} disabled={isSignAvailable}>
            signArbitrary osmosis-1
          </Button> */}
        </div>
        <div className="py-10">
          <pre>{JSON.stringify(accounts, null, 2)}</pre>
        </div>

        <div className="py-10">
          <pre>{JSON.stringify(signature?.signature?.signature)}</pre>
        </div>
      </div>
    </Container>
  );
}
