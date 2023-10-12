import { Button } from '@haqq/shell-ui-kit';
import type { Keplr } from '@keplr-wallet/types';
import { CosmosAirdropCard } from '../cosmos-airdrop-card/cosmos-airdrop-card';
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

export function AirdropCosmos({
  airdropEndpoint,
  keplrAccounts,
  connectKeplrWallet,
  notConnectedKeplr,
}: {
  airdropEndpoint?: string;
  connectKeplrWallet: () => void;
  keplrAccounts: Record<string, string>;
  notConnectedKeplr: boolean;
}) {
  return (
    <BlurredBlock
      isBlurred={notConnectedKeplr}
      blurredContent={
        <div className="grid grid-cols-1 gap-[48px] lg:grid-cols-2 2xl:grid-cols-3">
          <CosmosAirdropCard
            participationAddressCosmos={keplrAccounts['cosmos']}
            participationAddressEvmos={keplrAccounts['evmos']}
            icon={cosmosIcon}
            chainId="cosmoshub-4"
            airdropEndpoint={airdropEndpoint}
            isEvmos={false}
          />
          <BlurredBlock
            isBlurred={true}
            content="Coming soon!"
            blurredContent={
              <CosmosAirdropCard
                icon={evmosIcon}
                participationAddressCosmos={''}
                participationAddressEvmos={''}
                chainId="evmos_9001-2"
                airdropEndpoint={airdropEndpoint}
                isEvmos={true}
              />
            }
          />
        </div>
      }
      content={
        <div className="flex flex-col items-center space-y-[12px] py-[58px]">
          <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            Connect via Keplr to see
          </div>
          <Button
            className="text-black hover:bg-transparent hover:text-white"
            onClick={connectKeplrWallet}
            variant={2}
          >
            Connect to Keplr
          </Button>
        </div>
      }
    />
  );
}
