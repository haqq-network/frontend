import { useCallback, useState } from 'react';
import {
  ethToHaqq,
  getKeplrWallet,
  haqqToEth,
  useAddress,
  useWallet,
} from '@haqq/shared';
import { CaptchaModal, Container, Heading } from '@haqq/shell-ui-kit';
import { AirdropEvm } from '../../lib/airdrop-evm/airdrop-evm';
import {
  AirdropCosmos,
  addHaqqNetwork,
} from '../../lib/airdrop-cosmos/airdrop-cosmos';
import { Address } from '../../lib/address/address';
import { Keplr } from '@keplr-wallet/types';
import Link from 'next/link';

async function enableChains(keplrWallet: Keplr) {
  await keplrWallet.enable(['haqq_11235-1', 'cosmoshub-4', 'evmos_9001-2']);
}

export function AirdropPage({
  turnstileSiteKey,
  airdropEndpoint,
}: {
  turnstileSiteKey?: string;
  airdropEndpoint?: string;
}) {
  const { ethAddress } = useAddress();
  const hasMetamaskConnected = !!ethAddress;
  const [ethAddressFromKeplr, setEthAddressFromKepler] = useState('');

  const targetHexAddress = ethAddress || ethAddressFromKeplr;

  const [keplrAccounts, setKeplrAccounts] = useState<Record<string, string>>(
    {},
  );

  const { disconnect } = useWallet();

  const notConnectedKeplr =
    Object.keys(keplrAccounts).length === 0 || hasMetamaskConnected;

  const connectKeplrWallet = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();

    if (hasMetamaskConnected) {
      disconnect();
    }

    if (keplrWallet) {
      try {
        await enableChains(keplrWallet);
      } catch (e) {
        await addHaqqNetwork(keplrWallet);
      } finally {
        await enableChains(keplrWallet);
      }

      const [haqq, cosmos, evmos] = await Promise.all([
        await keplrWallet.getKey('haqq_11235-1'),
        await keplrWallet.getKey('cosmoshub-4'),
        await keplrWallet.getKey('evmos_9001-2'),
      ]);

      setEthAddressFromKepler(haqqToEth(haqq.bech32Address));

      setKeplrAccounts({
        haqq: haqq.bech32Address,
        cosmos: cosmos.bech32Address,
        evmos: evmos.bech32Address,
      });
    }
  }, [disconnect, setEthAddressFromKepler, hasMetamaskConnected]);

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div>
            <div className="font-clash text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
              Airdrop
            </div>
            {targetHexAddress ? (
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
            ) : (
              <div className="mt-[8px] flex flex-col gap-[12px]">
                <div>
                  Reward distribution is in progress! Your rewards will be on
                  their way to you shortly. Thank you for your patience and
                  support.
                </div>

                <div>
                  Webpage is specially designed for users who participated in
                  the 3rd Wave of the HAQQ Expedition on Galaxy, but whose
                  responses to the "MAIN HAQQ Wallet" prompt weren't saved in
                  Galxe,{' '}
                  <Link
                    target="_blank"
                    className="text-haqq-orange"
                    rel="noopener noreferrer"
                    href=" https://shell.haqq.network/airdrop/revision-address"
                  >
                    is avaliabe here.
                  </Link>
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

              <AirdropEvm
                ethAddress={targetHexAddress}
                airdropEndpoint={airdropEndpoint}
                isCosmos={!notConnectedKeplr}
                connectKeplrWallet={connectKeplrWallet}
              />
            </div>

            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-row items-center">
                <Heading level={3} className="mb-[-2px]">
                  Cosmos ecosystem drop
                </Heading>
              </div>

              <AirdropCosmos
                airdropEndpoint={airdropEndpoint}
                keplrAccounts={keplrAccounts}
                notConnectedKeplr={notConnectedKeplr}
                connectKeplrWallet={
                  notConnectedKeplr ? connectKeplrWallet : undefined
                }
              />
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