import { CosmosAirdropCard } from '../cosmos-airdrop-card/cosmos-airdrop-card';
import cosmosIcon from './../../assets/icons/cosmos.svg';
import evmosIcon from './../../assets/icons/evmos.svg';

export function CosmosAirdropView({
  cosmosAddress,
  ethAddressFromKeplr,
  airdropEndpoint,
}: {
  cosmosAddress: string;
  ethAddressFromKeplr: string;
  airdropEndpoint?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-20 md:grid-cols-2 2xl:grid-cols-3">
      <CosmosAirdropCard
        participationAddress={cosmosAddress}
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
  );
}
