import { Button, CaptchaModal, Container } from '@haqq/shell-ui-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ethToHaqq,
  useAddress,
  useAirdropActions,
  useWallet,
} from '@haqq/shared';
import { Address } from './../address/address';
import localStore from 'store2';
import { EvmAirdropView } from '../evm-airdrop-view/evm-airdrop-view';

const MESSAGE = 'Haqqdrop!';

export function AirdropEvm({
  turnstileSiteKey,
}: {
  turnstileSiteKey?: string;
}) {
  const { sign } = useAirdropActions();

  const { ethAddress } = useAddress();
  const { openSelectWallet } = useWallet();

  const localStKey = useMemo(() => {
    return `SAVED_EVM_AIRDROP_SIGNATURE_KEY_${ethAddress}`;
  }, [ethAddress]);

  const [signature, setSignature] = useState('');

  const onSignHandler = useCallback(async () => {
    if (!ethAddress) {
      return;
    }
    const signature = await sign(ethAddress, MESSAGE);
    localStore.set(localStKey, signature);
    setSignature(signature);
  }, [ethAddress, localStKey, sign]);

  const [token, setToken] = useState<string | undefined>(undefined);
  const [isCaptchaModalOpen, setCaptchaModalOpen] = useState(false);

  useEffect(() => {
    if (ethAddress) {
      if (signature && !token) {
        setCaptchaModalOpen(true);
      }
      if (signature !== localStore.get(localStKey)) {
        setSignature(localStore.get(localStKey));
      }
    }
  }, [ethAddress, token, localStKey, signature]);

  return (
    <div>
      <div className="py-[32px] lg:py-[68px]">
        <Container>
          <div className="font-serif text-[28px] uppercase leading-none sm:text-[48px] lg:text-[70px]">
            AIRDROP
          </div>

          {ethAddress && (
            <div className="mt-[8px] flex flex-col gap-[28px] sm:flex-col md:flex-row lg:flex-row">
              <div>
                <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                  Your haqq address hex
                </div>

                <Address address={ethAddress} />
              </div>
              <div>
                <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
                  Your haqq address bech32
                </div>
                <Address address={ethToHaqq(ethAddress)} />
              </div>
            </div>
          )}
        </Container>
      </div>

      <div className="flex flex-1 flex-col space-y-[12px] border-t border-[#ffffff26] px-[16px] py-[24px] sm:px-[48px] sm:py-[24px] lg:pb-[60px] lg:pl-[80px] lg:pr-[80px] lg:pt-[60px]">
        {!ethAddress ? (
          <div className="m-auto flex flex-1 flex-col">
            <div className="mb-[12px]">You should connect wallet first</div>
            <Button className="w-full" onClick={openSelectWallet}>
              Connect wallet
            </Button>
          </div>
        ) : signature ? (
          <EvmAirdropView
            address={ethAddress}
            captchaToken={token}
            message={MESSAGE}
            signature={signature}
          />
        ) : (
          <div className="m-auto flex flex-1 flex-col">
            <Button className="w-full" onClick={onSignHandler}>
              Sign Message
            </Button>
          </div>
        )}

        <CaptchaModal
          setCaptchaModalOpen={setCaptchaModalOpen}
          turnstileSiteKey={turnstileSiteKey}
          isOpened={isCaptchaModalOpen}
          setToken={setToken}
        />
      </div>
    </div>
  );
}
