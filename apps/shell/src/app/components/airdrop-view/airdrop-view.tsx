import { AirdropCard } from "../airdrop-card/airdrop-card";
import cosmosIcon from './../../../assets/icons/cosmos.svg'
import evmosIcon from './../../../assets/icons/evmos.svg'
import osmosisIcon from './../../../assets/icons/osmosis.svg'


interface IProps {
    cosmosAddress: string;
    osmosisAddress: string;
    evmosAddress: string;
}

export const AirdropView = ({
    cosmosAddress,
    osmosisAddress,
    evmosAddress,
}: IProps) => {

    return <div className="grid grid-flow-row grid-cols-3 gap-[20px]">
        <AirdropCard address={cosmosAddress} icon={cosmosIcon}/>
        <AirdropCard address={osmosisAddress} icon={evmosIcon}/>
        <AirdropCard address={evmosAddress} icon={osmosisIcon}/>
    </div> 
}