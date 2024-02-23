import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { isAddress } from 'viem';
import {
  ethToHaqq,
  getFormattedAddress,
  haqqToEth,
  useClipboard,
  useWallet,
} from '@haqq/shared';
import { Container, CopyIcon, Heading, WalletIcon } from '@haqq/shell-ui-kit';

export function MultisigAddressPage() {
  const { address } = useParams();
  const { isHaqqWallet } = useWallet();
  const [multisigAddress, setMultisigAddress] = useState<
    { eth: string; haqq: string } | undefined
  >(undefined);

  useEffect(() => {
    if (address) {
      if (address.startsWith('0x')) {
        const isValidEthAddress = isAddress(address);

        if (isValidEthAddress) {
          const haqq = ethToHaqq(address);
          setMultisigAddress({
            eth: address,
            haqq,
          });
        }
      } else if (address.startsWith('haqq1')) {
        const eth = haqqToEth(address);
        const isValidEthAddress = isAddress(eth);
        if (isValidEthAddress) {
          setMultisigAddress({
            eth,
            haqq: address,
          });
        }
      }
    }
  }, [address]);

  if (!address) {
    return <Navigate to="/not-found" replace />;
  }

  if (!multisigAddress) {
    return <div>PendingPage</div>;
  }

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

      <div className="border-y-[1px] border-[#FFFFFF26]">
        <Container>
          <div className="flex flex-col divide-y divide-dashed divide-[#FFFFFF26] py-[32px]">
            <div className="pb-[32px]">
              <div className="flex flex-row items-center">
                <WalletIcon />
                <Heading level={3} className="mb-[-2px] ml-[8px]">
                  Account:
                </Heading>

                <div className="ml-[16px]">
                  <AccountAddresses address={multisigAddress} />
                </div>
              </div>

              <div className="mt-[16px] flex flex-row gap-[32px]">
                <div className="text-[12px] uppercase leading-[16px]">
                  <span className="">Threshold</span>&nbsp;
                  <span className="text-white">2</span>&nbsp;
                  <span className="text-white/25">from 3</span>
                </div>

                <div className="text-[12px] uppercase leading-[16px]">
                  Members
                </div>
              </div>
            </div>
            <div className="pt-[32px]">
              <div className="text-[12px] uppercase leading-[16px] text-[#FFFFFF80]">
                Balance
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

function AccountAddresses({
  address,
}: {
  address: { eth: string; haqq: string };
}) {
  return (
    <div className="flex flex-row gap-[16px]">
      <div className="flex flex-row items-center gap-[4px]">
        {getFormattedAddress(address.haqq, 6)}
        <CopyButton text={address.haqq} />
      </div>
      <div className="flex flex-row items-center gap-[4px]">
        {getFormattedAddress(address.eth, 6)}
        <CopyButton text={address.eth} />
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { copyText } = useClipboard();
  const handleTextCopy = useCallback(() => {
    copyText(text);
  }, [copyText, text]);

  return (
    <button onClick={handleTextCopy}>
      <CopyIcon className="cursor-pointer text-white/60 transition-colors duration-150 hover:text-white" />
    </button>
  );
}
