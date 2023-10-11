import { useState } from 'react';
import { ethToHaqq, useAddress } from '@haqq/shared';
import { CaptchaModal, Container, Heading } from '@haqq/shell-ui-kit';
import { AirdropEvm } from '../airdrop-evm/airdrop-evm';
import { AirdropCosmos } from '../airdrop-cosmos/airdrop-cosmos';
import { Address } from '../address/address';

export function AirdropPage({
  turnstileSiteKey,
  airdropEndpoint,
}: {
  turnstileSiteKey?: string;
  airdropEndpoint?: string;
}) {
  const { ethAddress } = useAddress();
  const [ethAddressFromKeplr, setEthAddressFromKepler] = useState('');

  const targetHexAddress = ethAddress || ethAddressFromKeplr;

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Airdrop
            </div>
            {targetHexAddress && (
              <div className="mt-[8px] flex flex-col gap-[28px] sm:flex-col md:flex-row lg:flex-row">
                <div>
                  <div className="font-guise text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                    Your HAQQ address hex
                  </div>

                  <Address address={targetHexAddress.toLowerCase()} />
                </div>
                <div>
                  <div className="font-guise text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                    Your HAQQ address bech32
                  </div>
                  <Address address={ethToHaqq(targetHexAddress)} />
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      <div className="border-t border-[#ffffff26] py-[52px] sm:py-[60px] lg:py-[80px]">
        <Container>
          <div className="flex flex-col gap-[52px]">
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-row items-center">
                <Heading level={3} className="mb-[-2px]">
                  Community drop
                </Heading>
              </div>
              <div>
                <AirdropEvm
                  ethAddress={ethAddress}
                  airdropEndpoint={airdropEndpoint}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-row items-center">
                <Heading level={3} className="mb-[-2px]">
                  Cosmos ecosystem drop
                </Heading>
              </div>

              <div>
                <AirdropCosmos
                  hasMetamaskConnected={!!ethAddress}
                  setEthAddressFromKepler={setEthAddressFromKepler}
                  ethAddressFromKeplr={ethAddressFromKeplr}
                  airdropEndpoint={airdropEndpoint}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <CaptchaModal
        turnstileSiteKey={turnstileSiteKey}
        isClosable={!!ethAddress}
      />
    </div>
  );
}
