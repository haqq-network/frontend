import { ethToHaqq, useAddress, useWallet } from '@haqq/shared';
import { Button, CaptchaModal, Container } from '@haqq/shell-ui-kit';
import { CheckWalletExplanation } from '../../lib/check-wallet-explanation/check-wallet-explanation';
import {
  AirdropInfo,
  useWalletInfoChecker,
} from '../../lib/airdrop-info/airdrop-info';
import { useMemo } from 'react';
import { BlurredBlock } from '../../lib/blured-block/blured-block';
import { NotAllowedWallet } from '../../lib/not-allowed-wallet/not-allowed-wallet';

export function WalletCheckPage({
  turnstileSiteKey,
  walletCheckEndpoint,
}: {
  turnstileSiteKey?: string;
  walletCheckEndpoint?: string;
}) {
  const { ethAddress } = useAddress();

  const { openSelectWallet } = useWallet();

  const haqqAddress = useMemo(() => {
    return ethAddress ? ethToHaqq(ethAddress) : ''; // && 'haqq12nw2gkj3jh994zmuzpj2t73fprzkdxeegawaql';
  }, [ethAddress]);

  const { walletInfo, loading } = useWalletInfoChecker(
    walletCheckEndpoint,
    haqqAddress,
  );

  const notAllowed = !walletInfo && !loading && haqqAddress;

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            Rewards Address Revision
          </div>
        </Container>
      </div>

      <div className="border-t  py-[52px] sm:py-[60px] lg:py-[80px]">
        <Container>
          {notAllowed ? (
            <NotAllowedWallet />
          ) : (
            <div className="flex flex-col items-center gap-[62px]">
              <div className="flex gap-[58px]">
                <div
                  className={`${
                    ethAddress ? 'max-w-[360px]' : 'max-w-[800px]'
                  }`}
                >
                  <CheckWalletExplanation />
                </div>
                <BlurredBlock
                  isBlurred={loading}
                  content="Loading..."
                  blurredContent={
                    <AirdropInfo
                      walletInfo={walletInfo}
                      address={haqqAddress}
                      walletCheckEndpoint={walletCheckEndpoint}
                    />
                  }
                />
              </div>

              {!ethAddress && (
                <div className="flex flex-col items-center space-y-[12px] ">
                  <div className="font-guise text-[14px] leading-[22px] md:text-[18px] md:leading-[28px]">
                    You should connect wallet first
                  </div>
                  <Button
                    onClick={openSelectWallet}
                    variant={2}
                    className="w-[280px] text-black hover:bg-transparent hover:text-white"
                  >
                    Connect wallet
                  </Button>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>

      <CaptchaModal
        turnstileSiteKey={turnstileSiteKey}
        isClosable={!!ethAddress}
      />
    </div>
  );
}
