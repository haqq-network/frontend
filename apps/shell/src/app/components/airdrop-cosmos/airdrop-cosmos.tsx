import { Button } from '@haqq/shell-ui-kit';
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types';
import { useCallback, useState } from 'react';
import { ecrecover, fromRpcSig } from '@ethereumjs/util';
import { CosmosAirdropView } from './../cosmos-airdrop-view/cosmos-airdrop-view';
import { haqqToEth, useWallet } from '@haqq/shared';
import { getKeplrWallet } from '../cosmos-airdrop-card/cosmos-airdrop-card';
import { BluredBlock } from '../blured-block/blured-block';

export async function AddTestEdge2Network(keplrWallet: Keplr) {
  try {
    await keplrWallet.experimentalSuggestChain({
      features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
      chainId: 'haqq_11235-1',
      chainName: 'HAQQ Mainnet',
      rpc: 'https://m-s1-tm.haqq.sh',
      rest: 'https://m-s1-sdk.haqq.sh',
      bip44: {
        coinType: 60,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'haqq',
        bech32PrefixAccPub: 'haqq' + 'pub',
        bech32PrefixValAddr: 'haqq' + 'valoper',
        bech32PrefixValPub: 'haqq' + 'valoperpub',
        bech32PrefixConsAddr: 'haqq' + 'valcons',
        bech32PrefixConsPub: 'haqq' + 'valconspub',
      },
      currencies: [
        {
          // Coin denomination to be displayed to the user.
          coinDenom: 'ISLM',
          coinMinimalDenom: 'aISLM',
          coinDecimals: 18,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'ISLM',
          coinMinimalDenom: 'aISLM',
          coinDecimals: 18,
        },
      ],
      stakeCurrency: {
        coinDenom: 'ISLM',
        coinMinimalDenom: 'aISLM',
        coinDecimals: 18,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export function signatureToPubkey(signature: string, msgHash: Buffer) {
  const ret = fromRpcSig(signature);
  return ecrecover(msgHash, ret.v, ret.r, ret.s);
}

const enableChains = async (keplrWallet: Keplr) => {
  await keplrWallet.enable(['haqq_11235-1', 'cosmoshub-4', 'evmos_9001-2']);
};

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
      try {
        await enableChains(keplrWallet);
      } catch (e) {
        await AddTestEdge2Network(keplrWallet);
      } finally {
        await enableChains(keplrWallet);
      }

      const [haqq, cosmos, evmos] = await Promise.all([
        await keplrWallet.getKey('haqq_11235-1'),
        await keplrWallet.getKey('cosmoshub-4'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      setEthAddressFromKeppler(haqqToEth(haqq.bech32Address));

      setAccounts({
        haqq: haqq.bech32Address,
        cosmos: cosmos.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [disconnect, setEthAddressFromKeppler, hasMetamaskConnected]);

  return (
    <BluredBlock
      title="Cosmos ecosystem drop"
      isBlured={notConnectedKeppler}
      bluredContent={
        <CosmosAirdropView
          cosmosAddress={accounts['cosmos']}
          ethAddressFromKeppler={ethAddressFromKeppler}
        />
      }
      content={
        <>
          <div className="mb-[12px] text-[24px]">Coming soon!</div>
          {false && (
            <Button
              className="pl-[32px] pr-[32px]"
              onClick={connectKeplrWallet}
            >
              Connect to Keplr
            </Button>
          )}
        </>
      }
    />
  );
}
