import { WebsiteProviders, ethToHaqq, useAddress } from '@haqq/shared';
import { AirdropEvm } from './components/airdrop-evm/airdrop-evm';
import {
  NX_WALLETCONNECT_PROJECT_ID,
  TURNSTILE_SITEKEY,
  VERCEL_ENV,
} from './constants';
import { SelectWalletModalWrapper } from './components/select-wallet-modal-wrapper/select-wallet-modal-wrapper';
import { useState } from 'react';
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

function Airdrops() {
  const { ethAddress } = useAddress();
  const [ethAddressFromKeppler, setEthAddressFromKepler] = useState('');

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
                  Your HAQQ address hex
                </div>

                <Address address={targetHexAddress} />
              </div>
              <div>
                <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                  Your HAQQ address bech32
                </div>
                <Address address={ethToHaqq(targetHexAddress)} />
              </div>
            </div>
          )}
        </Container>
      </div>

      <div className="border-t border-[#ffffff26] py-[52px] sm:py-[60px] lg:py-[80px]">
        <Container>
          <div className="flex flex-col gap-[52px] sm:gap-[60px] lg:gap-[80px]">
            <div>
              <AirdropEvm ethAddress={ethAddress} />
            </div>

            <div>
              <AirdropCosmos
                hasMetamaskConnected={!!ethAddress}
                setEthAddressFromKepler={setEthAddressFromKepler}
                ethAddressFromKeppler={ethAddressFromKeppler}
              />
            </div>
          </div>
        </Container>
      </div>

      <CaptchaModal
        turnstileSiteKey={TURNSTILE_SITEKEY}
        isClosable={!!ethAddress}
      />
    </>
  );
}
