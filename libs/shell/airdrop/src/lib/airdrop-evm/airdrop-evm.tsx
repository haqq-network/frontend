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
            address={ethAddress || ''}
            airdropEndpoint={airdropEndpoint}
            isCosmos={isCosmos}
          />
        </div>
      }
      content={
        <div className="flex flex-col items-center space-y-[12px] py-[58px]">
          <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
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

export function AirdropFinished() {
  return (
    <div className="pb-[48px]">
      <p
        className="font-guise max-w-[740px] text-[12px] font-[500] leading-[18px] text-white
        md:text-[14px] md:leading-[22px]"
      >
        We would like to express our sincere gratitude to all participants for
        their interest and involvement in the Community Drop event. Please be
        informed that the application submission period and address updates were
        closed on November 1, 2023. The previously submitted requests for
        address changes will be processed in due course. We will provide a
        separate update on this matter. Thank you very much for your active
        participation and support.
      </p>
    </div>
  );
}
