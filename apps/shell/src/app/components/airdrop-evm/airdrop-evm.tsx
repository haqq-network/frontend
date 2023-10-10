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
        <>
          <div className="mb-[12px]">Connect via Metamask to see</div>
          <Button className="pl-[32px] pr-[32px]" onClick={openSelectWallet}>
            Connect wallet
          </Button>
        </>
      }
    />
  );
}
