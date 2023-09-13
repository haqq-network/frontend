import { Address, Button, Container } from '@haqq/shell-ui-kit';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';
import { ecrecover, fromRpcSig } from '@ethereumjs/util';
import { AirdropView } from './components/airdrop-view/airdrop-view';
import { haqqToEth } from '@haqq/shared';

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
      await keplrWallet.enable(['haqq_54211-3', 'cosmoshub-4', 'osmosis-1', 'evmos_9001-2']);

      const [ haqq, cosmos, osmosis, evmos] = await Promise.all([
        await keplrWallet.getKey('haqq_54211-3'),
        await keplrWallet.getKey('cosmoshub-4'),
        await keplrWallet.getKey('osmosis-1'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      setAccounts({
        haqq: haqq.bech32Address,
        cosmos: cosmos.bech32Address,
        osmosis: osmosis.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [getKeplrWallet]);

  useEffect(() => {
    connectKeplrWallet()
  }, [connectKeplrWallet])

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

  const connectedAccounts = Object.keys(accounts).length > 0;

  return (
    <div>
       <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            AIRDROP
          </div>

         {connectedAccounts && accounts['haqq'] && <div className='mt-[8px] flex flex-row gap-[28px]'>
            <div>
              <div className='font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px] uppercase'>
                Your haqq address hex 
              </div>
              
              <Address address={haqqToEth(accounts['haqq'])} />
            </div>
            <div>
              <div className='font-sans text-[11px] leading-[18px] text-white/50 md:text-[12px] md:leading-[18px] uppercase'>Your haqq address bech32</div>
              <Address address={accounts['haqq']} />
            </div>
          </div>}
        </Container>
      </div>

      <div className="flex flex-1 flex-col items-center space-y-[12px] border-t border-[#ffffff26]">
        <div className="flex flex-1 flex-col py-20">
          {connectedAccounts ? <AirdropView cosmosAddress={accounts['cosmos']} evmosAddress={accounts['evmos']} osmosisAddress={accounts['osmosis']}/> : <>
            <div className='mb-[12px]'>
              You should connect kepler first
            </div>
            <Button onClick={connectKeplrWallet}>Connect to kepler</Button>
          </>}
        </div>
      </div>
    </div>
    
  );
}
