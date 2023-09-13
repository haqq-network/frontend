import { Button, Container } from '@haqq/shell-ui-kit';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';
import { useCallback, useState } from 'react';
import { ecrecover, fromRpcSig } from '@ethereumjs/util';
import { AirdropView } from './components/airdrop-view/airdrop-view';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export function signatureToPubkey(signature: string, msgHash: Buffer) {
  const ret = fromRpcSig(signature);
  return ecrecover(msgHash, ret.v, ret.r, ret.s);
}

export function AirdropPage() {
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [_, setSignature] = useState<string>('');

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
      await keplrWallet.enable(['cosmoshub-4', 'osmosis-1', 'evmos_9001-2']);

      const [ cosmos, osmosis, evmos] = await Promise.all([
        await keplrWallet.getKey('cosmoshub-4'),
        await keplrWallet.getKey('osmosis-1'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      console.log({ cosmos, osmosis, evmos });

      setAccounts({
        cosmos: cosmos.bech32Address,
        osmosis: osmosis.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [getKeplrWallet]);

  const keplrSignArbitrary = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();
    if (keplrWallet) {

      const chainId = 'osmosis-1'; 

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

      setSignature(signatureArb.signature);
    }
  }, [getKeplrWallet]);


  return (
    <Container>
      <div className='py-[32px] lg:py-[68px]'>

        <div className='font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]'>AIRDROP</div>
      </div>
      <div className="flex flex-col items-center space-y-[12px] border-y border-[#ffffff26] py-[58px">
        <div className="flex flex-row gap-6 py-10">
          {Object.keys(accounts).length > 0  ? <AirdropView cosmosAddress={accounts['cosmos']} evmosAddress={accounts['evmos']} osmosisAddress={accounts['osmosis']}/> : <>
            <div className='mb-[12px]'>
              You should connect kepler first
            </div>
            <Button onClick={connectKeplrWallet}>Connect to kepler</Button>
          </>}
        </div>
      </div>
    </Container>
  );
}
