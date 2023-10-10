import { CosmosAirdropCard } from '../cosmos-airdrop-card/cosmos-airdrop-card';
import cosmosIcon from './../../../assets/icons/cosmos.svg';
import evmosIcon from './../../../assets/icons/evmos.svg';

interface IProps {
  cosmosAddress: string;
  ethAddressFromKeppler: string;
}

export const CosmosAirdropView = ({
  cosmosAddress,
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
        icon={evmosIcon}
        chainId="evmos_9001-2"
        ethAddressFromKeppler={ethAddressFromKeppler}
      />
    </div>
  );
};
