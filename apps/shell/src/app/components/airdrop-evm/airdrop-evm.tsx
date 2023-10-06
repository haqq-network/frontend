import { Button } from '@haqq/shell-ui-kit';
import { useWallet } from '@haqq/shared';
import { EvmAirdropView } from '../evm-airdrop-view/evm-airdrop-view';

export function AirdropEvm({ ethAddress }: { ethAddress?: string }) {
  const { openSelectWallet } = useWallet();

  return (
    <div>
      <div className="mb-[20px] text-[32px] font-[500]">Community drop</div>

      <div className="relative">
        <div
          className={`flex flex-col ${!ethAddress && 'opacity-50 blur-[6px]'}`}
        >
          <EvmAirdropView address={ethAddress} />
        </div>

        {!ethAddress && (
          <div className="absolute top-0 flex h-[100%] w-[100%] items-center">
            <div className="m-auto flex flex-col items-center">
              <div className="mb-[12px]">Connect via Metamask to see</div>
              <Button
                className="pl-[32px] pr-[32px]"
                onClick={openSelectWallet}
              >
                Connect wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
