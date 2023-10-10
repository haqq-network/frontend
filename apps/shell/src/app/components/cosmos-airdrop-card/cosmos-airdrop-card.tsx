import { useCallback } from 'react';
import { Address } from '../address/address';
import { ApproveBtn } from '../approve-btn/approve-btn';
import { useAirdropChecker } from '../evm-airdrop-view/evm-airdrop-view';
import { formatEthDecimal } from '@haqq/shell-ui-kit';
import { Keplr } from '@keplr-wallet/types';

interface IProps {
  participationAddress?: string;
  icon: string;
  chainId: string;
  ethAddressFromKeppler: string;
}

export const getKeplrWallet = async (): Promise<Keplr | undefined> => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve(window.keplr);
        console.log('getKeplrWallet', {
          version: window?.keplr?.version,
        });
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

const MSG = 'Haqqdrop!';

export const CosmosAirdropCard = ({
  participationAddress,
  ethAddressFromKeppler,
  icon,
  chainId,
}: IProps) => {
  const { participant } = useAirdropChecker(participationAddress);

  const keplrSignArbitrary = useCallback(async () => {
    const keplrWallet = await getKeplrWallet();
    if (keplrWallet) {
      const { bech32Address } = await keplrWallet.getKey(chainId);

      const signatureArb = await keplrWallet?.signArbitrary(
        chainId,
        bech32Address,
        MSG,
      );

      return {
        signature: signatureArb.signature,
        pubKey: signatureArb.pub_key.value,
      };
    } else {
      return {
        signature: '',
      };
    }
  }, [chainId]);

  const hasAirdrop = (participant?.amount || 0) > 0;

  return (
    <div className="flex flex-col items-start gap-[28px] md:w-[410px]">
      <img src={icon} alt="icon" className="mb-[4px] h-[48px]" />

      {participationAddress && (
        <div>
          <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
            Address
          </div>
          <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
            <Address address={participationAddress} />
          </div>
        </div>
      )}

      <div className="flex">
        <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
          It is possible to get an airdrop
        </div>
        <div className="flex items-center font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
          {(participant?.amount || 0) > 0 ? (
            <>
              <div className="text-[#01B26E]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.8772 5.38208L7.50881 16.0888L3.13062 11.2241L4.36944 10.1092L7.49125 13.5779L15.6229 4.28458L16.8772 5.38208Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="ml-[8px]">Yes</div>
            </>
          ) : (
            <div className="ml-[24px] flex flex-row items-center ">
              <div className="flex flex-row items-center ">
                <div className="mb-[-2px] ml-[4px] mr-[8px] h-2 w-2 rounded-full bg-[#FF5454] lg:mb-[-3px]"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasAirdrop ? (
        <>
          <div>
            <div className="font-sans text-[11px] uppercase leading-[18px] text-white/50 md:text-[12px] md:leading-[18px]">
              Amount airdrop
            </div>
            <div className="font-sans text-[14px] font-[500] leading-[22px] text-white md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]">
              {formatEthDecimal(participant?.amount || 0, 2)} ISLM
            </div>
          </div>

          <div className="mt-[4px]">
            <ApproveBtn
              participationAddress={participationAddress}
              message={MSG}
              participant={participant}
              isCosmos
              onSign={keplrSignArbitrary}
              ethAddress={ethAddressFromKeppler}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};
