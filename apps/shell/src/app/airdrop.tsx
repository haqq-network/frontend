import { WebsiteProviders, ethToHaqq, useAddress } from '@haqq/shared';
import { AirdropEvm } from './components/airdrop-evm/airdrop-evm';
import {
  NX_WALLETCONNECT_PROJECT_ID,
  VERCEL_ENV,
  TURNSTILE_SITEKEY,
} from './constants';
import { SelectWalletModalWrapper } from './components/select-wallet-modal-wrapper/select-wallet-modal-wrapper';
import { useEffect, useState } from 'react';
import { AirdropCosmos } from './components/airdrop-cosmos/airdrop-cosmos';
import { CaptchaModal, Container } from '@haqq/shell-ui-kit';
import { Address } from './components/address/address';

const walletConnectProjectId = NX_WALLETCONNECT_PROJECT_ID;
const isProduction = VERCEL_ENV === 'production';

export function Airdrop() {
  return (
    <WebsiteProviders
      walletConnectProjectId={walletConnectProjectId}
      withReactQueryDevtools={isProduction}
      isStandalone
    >
      <SelectWalletModalWrapper>
        <Airdrops />
      </SelectWalletModalWrapper>
    </WebsiteProviders>
  );
}

const Airdrops = () => {
  const { ethAddress } = useAddress();
  const [ethAddressFromKeppler, setEthAddressFromKeppler] = useState('');

  const [token, setToken] = useState<string | undefined>(undefined);
  const [isCaptchaModalOpen, setCaptchaModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setCaptchaModalOpen(true);
    }
  }, [token]);

  const targetHexAddress = ethAddress || ethAddressFromKeppler;

  return (
    <>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            AIRDROP
          </div>

          {targetHexAddress && (
            <div className="mt-[8px] flex flex-col gap-[28px] sm:flex-col md:flex-row lg:flex-row">
              <div>
                <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                  Your haqq address hex
                </div>

                <Address address={targetHexAddress} />
              </div>
              <div>
                <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                  Your haqq address bech32
                </div>
                <Address address={ethToHaqq(targetHexAddress)} />
              </div>
            </div>
          )}
        </Container>
      </div>

      <div className="flex flex-1 flex-col border-t border-[#ffffff26] px-[16px] py-[24px] sm:px-[48px] sm:py-[24px] lg:pb-[60px] lg:pl-[80px] lg:pr-[80px] lg:pt-[60px]">
        <AirdropEvm ethAddress={ethAddress} />

        <div className="mb-[100px] mt-[72px]">
          <AirdropCosmos
            hasMetamaskConnected={!!ethAddress}
            setEthAddressFromKeppler={setEthAddressFromKeppler}
            ethAddressFromKeppler={ethAddressFromKeppler}
          />
        </div>
      </div>

      <CaptchaModal
        setCaptchaModalOpen={setCaptchaModalOpen}
        turnstileSiteKey={TURNSTILE_SITEKEY}
        isOpened={isCaptchaModalOpen}
        setToken={setToken}
      />
    </>
  );
};
