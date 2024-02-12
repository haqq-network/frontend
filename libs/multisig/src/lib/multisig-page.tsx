import clsx from 'clsx';
import { useAddress, useWallet } from '@haqq/shared';
import { Button, Container } from '@haqq/shell-ui-kit';

export function MultisigPage() {
  const { ethAddress } = useAddress();
  const { openSelectWallet, isHaqqWallet } = useWallet();

  return (
    <div>
      {!isHaqqWallet && (
        <div className="py-[32px] lg:py-[68px]">
          <Container>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Multisig Manager
            </div>
          </Container>
        </div>
      )}

      <div className="flex flex-col gap-[32px]">
        {!ethAddress ? (
          <div
            className={clsx(
              'flex flex-col items-center space-y-[12px] py-[58px]',
              !isHaqqWallet && 'border-y border-[#ffffff26]',
            )}
          >
            <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
              You should connect wallet first
            </div>
            <Button onClick={openSelectWallet} variant={2}>
              Connect wallet
            </Button>
          </div>
        ) : (
          <div className="pb-[62px]"></div>
        )}
      </div>
    </div>
  );
}
