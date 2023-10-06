import { CosmosAirdropCard } from '../cosmos-airdrop-card/cosmos-airdrop-card';
import cosmosIcon from './../../../assets/icons/cosmos.svg';
import evmosIcon from './../../../assets/icons/evmos.svg';
import osmosisIcon from './../../../assets/icons/osmosis.svg';

interface IProps {
  cosmosAddress: string;
  osmosisAddress: string;
  evmosAddress: string;
  ethAddressFromKeppler: string;
}

export const CosmosAirdropView = ({
  cosmosAddress,
  osmosisAddress,
  evmosAddress,
  ethAddressFromKeppler,
}: IProps) => {
  return (
    <div className="grid grid-cols-1 gap-20 md:grid-cols-2 2xl:grid-cols-3">
      <CosmosAirdropCard
        participationAddress={cosmosAddress}
        icon={cosmosIcon}
        chainId="cosmoshub-4"
        ethAddressFromKeppler={ethAddressFromKeppler}
      />
      <CosmosAirdropCard
        participationAddress={osmosisAddress}
        icon={evmosIcon}
        chainId="osmosis-1"
        ethAddressFromKeppler={ethAddressFromKeppler}
      />
      <CosmosAirdropCard
        participationAddress={evmosAddress}
        icon={osmosisIcon}
        chainId="evmos_9001-2"
        ethAddressFromKeppler={ethAddressFromKeppler}
      />
    </div>
  );
};
