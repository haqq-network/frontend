import { Button } from '@haqq/shell-ui-kit';
import type { Keplr } from '@keplr-wallet/types';
import { useCallback, useState } from 'react';
import { haqqToEth, useWallet } from '@haqq/shared';
import {
  CosmosAirdropCard,
  getKeplrWallet,
} from '../cosmos-airdrop-card/cosmos-airdrop-card';
import { BlurredBlock } from '../blured-block/blured-block';
import cosmosIcon from './../../assets/icons/cosmos.svg';
import evmosIcon from './../../assets/icons/evmos.svg';

export async function addHaqqNetwork(keplrWallet: Keplr) {
  const basePrefix = 'haqq';
  try {
    await keplrWallet.experimentalSuggestChain({
      features: ['ibc-transfer', 'ibc-go', 'eth-address-gen', 'eth-key-sign'],
      chainId: 'haqq_11235-1',
      chainName: 'HAQQ Mainnet',
      rpc: 'https://rpc.tm.haqq.network',
      rest: 'https://rest.cosmos.haqq.network',
      bip44: {
        coinType: 60,
      },
      bech32Config: {
        bech32PrefixAccAddr: basePrefix,
        bech32PrefixAccPub: `${basePrefix}pub`,
        bech32PrefixValAddr: `${basePrefix}valoper`,
        bech32PrefixValPub: `${basePrefix}valoperpub`,
        bech32PrefixConsAddr: `${basePrefix}valcons`,
        bech32PrefixConsPub: `${basePrefix}valconspub`,
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

async function enableChains(keplrWallet: Keplr) {
  await keplrWallet.enable(['haqq_11235-1', 'cosmoshub-4', 'evmos_9001-2']);
}

export function AirdropCosmos({
  hasMetamaskConnected,
  setEthAddressFromKepler,
  ethAddressFromKeplr,
  airdropEndpoint,
}: {
  ethAddressFromKeplr: string;
  hasMetamaskConnected: boolean;
  setEthAddressFromKepler: (haqqAddress: string) => void;
  airdropEndpoint?: string;
}) {
  const [accounts, setAccounts] = useState<Record<string, string>>({});

  const { disconnect } = useWallet();

  const notConnectedKeplr =
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
        await addHaqqNetwork(keplrWallet);
      } finally {
        await enableChains(keplrWallet);
      }

      const [haqq, cosmos, evmos] = await Promise.all([
        await keplrWallet.getKey('haqq_11235-1'),
        await keplrWallet.getKey('cosmoshub-4'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      setEthAddressFromKepler(haqqToEth(haqq.bech32Address));

      setAccounts({
        haqq: haqq.bech32Address,
        cosmos: cosmos.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [disconnect, setEthAddressFromKepler, hasMetamaskConnected]);

  return (
    <BlurredBlock
      isBlurred={notConnectedKeplr}
      blurredContent={
        <div className="grid grid-cols-1 gap-[48px] lg:grid-cols-2 2xl:grid-cols-3">
          <CosmosAirdropCard
            participationAddress={accounts['cosmos']}
            icon={cosmosIcon}
            chainId="cosmoshub-4"
            ethAddressFromKeplr={ethAddressFromKeplr}
            airdropEndpoint={airdropEndpoint}
          />
          <CosmosAirdropCard
            icon={evmosIcon}
            chainId="evmos_9001-2"
            ethAddressFromKeplr={ethAddressFromKeplr}
            airdropEndpoint={airdropEndpoint}
          />
        </div>
      }
      content={
        <div className="flex flex-col items-center space-y-[12px] py-[58px]">
          <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            Coming soon!
          </div>
          {false && (
            <Button
              className="pl-[32px] pr-[32px]"
              onClick={connectKeplrWallet}
            >
              Connect to Keplr
            </Button>
          )}
        </div>
      }
    />
  );
}
