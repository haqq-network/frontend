import { BluredBlock } from '../blured-block/blured-block';
import { CosmosAirdropCard } from '../cosmos-airdrop-card/cosmos-airdrop-card';
import cosmosIcon from './../../../assets/icons/cosmos.svg';
import evmosIcon from './../../../assets/icons/evmos.svg';

interface IProps {
  cosmosAddress: string;
  osmosisAddress: string;
  evmosAddress: string;
  ethAddressFromKeppler: string;
}

export const CosmosAirdropView = ({
  cosmosAddress,
  evmosAddress,
  ethAddressFromKeppler,
}: IProps) => {
  return (
    <div className="grid grid-cols-1 gap-20 md:grid-cols-2 2xl:grid-cols-2">
      <CosmosAirdropCard
        participationAddress={cosmosAddress}
        icon={cosmosIcon}
        chainId="cosmoshub-4"
        ethAddressFromKeppler={ethAddressFromKeppler}
      />
      <BluredBlock
        isBlured
        bluredContent={
          <CosmosAirdropCard
            participationAddress={evmosAddress}
            icon={evmosIcon}
            chainId="evmos_9001-2"
            ethAddressFromKeppler={ethAddressFromKeppler}
          />
        }
        content={
          <>
            <div className="font-guise mb-[8px] text-[24px] font-[500]">
              Evmos Airdrop
            </div>
            <div>Coming soon</div>
          </>
        }
      />
    </div>
  );
};
