import { Button } from '@haqq/shell-ui-kit';
import { useWallet } from '@haqq/shared';
import { EvmAirdropView } from '../evm-airdrop-view/evm-airdrop-view';
import { BlurredBlock } from '../blured-block/blured-block';

export function AirdropEvm({
  ethAddress,
  airdropEndpoint,
  isCosmos,
  connectKeplrWallet,
}: {
  ethAddress?: string;
  airdropEndpoint?: string;
  isCosmos?: boolean;
  connectKeplrWallet: () => void;
}) {
  const { openSelectWallet } = useWallet();

  return (
    <BlurredBlock
      isBlurred={!ethAddress}
      blurredContent={
        <div className="grid grid-cols-1 gap-[48px] lg:grid-cols-2 2xl:grid-cols-3">
          <EvmAirdropView
            address={ethAddress}
            airdropEndpoint={airdropEndpoint}
            isCosmos={isCosmos}
          />
        </div>
      }
      content={
        <div className="flex flex-col items-center space-y-[12px] py-[58px]">
          <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            You should connect wallet first
          </div>
          <Button
            onClick={openSelectWallet}
            variant={2}
            className="w-[280px] text-black hover:bg-transparent hover:text-white"
          >
            Connect EVM wallet
          </Button>
          <Button
            className="mt-[8px] w-[280px] text-black hover:bg-transparent hover:text-white"
            onClick={connectKeplrWallet}
            variant={2}
          >
            Connect Keplr
          </Button>
        </div>
      }
    />
  );
}
