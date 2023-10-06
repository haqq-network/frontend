import { Button } from '@haqq/shell-ui-kit';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import { useCallback, useState } from 'react';
import { ecrecover, fromRpcSig } from '@ethereumjs/util';
import { CosmosAirdropView } from './../cosmos-airdrop-view/cosmos-airdrop-view';
import { haqqToEth, useWallet } from '@haqq/shared';
import { getKeplrWallet } from '../cosmos-airdrop-card/cosmos-airdrop-card';
import { BluredBlock } from '../blured-block/blured-block';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export function signatureToPubkey(signature: string, msgHash: Buffer) {
  const ret = fromRpcSig(signature);
  return ecrecover(msgHash, ret.v, ret.r, ret.s);
}

export function AirdropCosmos({
  hasMetamaskConnected,
  setEthAddressFromKeppler,
  ethAddressFromKeppler,
}: {
  ethAddressFromKeppler: string;
  hasMetamaskConnected: boolean;
  setEthAddressFromKeppler: (haqqAddress: string) => void;
}) {
  const [accounts, setAccounts] = useState<Record<string, string>>({});

  const { disconnect } = useWallet();

  const notConnectedKeppler =
    Object.keys(accounts).length === 0 || hasMetamaskConnected;

  const connectKeplrWallet = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();

    if (hasMetamaskConnected) {
      disconnect();
    }

    if (keplrWallet) {
      await keplrWallet.enable([
        'haqq_54211-3',
        'cosmoshub-4',
        'osmosis-1',
        'evmos_9001-2',
      ]);

      const [haqq, cosmos, osmosis, evmos] = await Promise.all([
        await keplrWallet.getKey('haqq_54211-3'),
        await keplrWallet.getKey('cosmoshub-4'),
        await keplrWallet.getKey('osmosis-1'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      setEthAddressFromKeppler(haqqToEth(haqq.bech32Address));

      setAccounts({
        haqq: haqq.bech32Address,
        cosmos: cosmos.bech32Address,
        osmosis: osmosis.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [disconnect, setEthAddressFromKeppler, hasMetamaskConnected]);

  return (
    <BluredBlock
      title="Cosmos ecosystem dro"
      isBlured={!notConnectedKeppler}
      bluredContent={
        <CosmosAirdropView
          cosmosAddress={accounts['cosmos']}
          evmosAddress={accounts['evmos']}
          osmosisAddress={accounts['osmosis']}
          ethAddressFromKeppler={ethAddressFromKeppler}
        />
      }
      content={
        <>
          <div className="mb-[12px]">Connect via Keplr to see</div>
          <Button className="pl-[32px] pr-[32px]" onClick={connectKeplrWallet}>
            Connect to Keplr
          </Button>
        </>
      }
    />
  );
}
