import { Button } from '@haqq/shell-ui-kit';
import { useWallet } from '@haqq/shared';
import { EvmAirdropView } from '../evm-airdrop-view/evm-airdrop-view';
import { BluredBlock } from '../blured-block/blured-block';

export function AirdropEvm({ ethAddress }: { ethAddress?: string }) {
  const { openSelectWallet } = useWallet();

  return (
    <BluredBlock
      title="Community drop"
      isBlured={!ethAddress}
      bluredContent={<EvmAirdropView address={ethAddress} />}
      content={
        <div className="flex flex-col items-center space-y-[12px] py-[58px]">
          <div className="font-sans text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
            You should connect wallet first
          </div>
          <Button
            onClick={openSelectWallet}
            variant={2}
            className="text-black hover:bg-transparent hover:text-white"
          >
            Connect wallet
          </Button>
        </div>
      }
    />
  );
}
