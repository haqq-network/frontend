'use client';
import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import iphoneWalletScreenshotData from '../../assets/images/wallet-iphone-screenshot.png';
import { CardText } from '../features-block/features-block';
import { getDynamicLink } from '../utils/get-dynamic-link';
import {
  WalletDownloadButton,
  WalletDownloadWithQrButton,
} from '../wallet-download-button/wallet-download-button';

function FeatureText({ children }: { children: ReactNode }) {
  return (
    <div className="mx-[8px] mb-[8px] inline-block text-center text-[14px] font-[500] leading-[22px] text-white sm:ml-0 sm:mr-[16px] sm:text-left">
      {children}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22.0541L12.2846 21.9487C18.0216 19.8239 21 16.1468 21 11V5.12198C20.9984 5.06763 20.9976 5.04049 20.9952 5.01349C20.9928 4.98656 20.9888 4.95977 20.9808 4.90626C20.8735 4.31054 20.352 3.9242 19.8158 4.04334L17.6735 4.51942C16.5629 4.76622 15.4148 4.37997 14.6139 3.49012L13.9092 2.70711C12.8548 1.53554 11.1452 1.53554 10.0908 2.70711L9.3861 3.49012C8.58524 4.37997 7.43711 4.76622 6.3265 4.51942L4.18415 4.04334L4.18415 4.04334C4.08771 4.02556 4.08771 4.02556 3.99 4.02198C3.44324 4.02198 3 4.51447 3 5.12198V11C3 16.1468 5.97841 19.8239 11.7154 21.9487L12 22.0541ZM19.2 6.21981V11C19.2 15.1073 16.8692 18.0625 12 19.9437C7.13081 18.0625 4.8 15.1073 4.8 11V6.21981L5.9735 6.48058C7.67425 6.85853 9.43247 6.26703 10.6589 4.90433L11.3636 4.12132C11.7151 3.7308 12.2849 3.7308 12.6364 4.12132L13.3411 4.90433C14.5675 6.26703 16.3258 6.85853 18.0265 6.48058L19.2 6.21981Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StakingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 13.5C4.44772 13.5 4 13.9477 4 14.5V18.5C4 19.6046 4.89543 20.5 6 20.5H18C19.1046 20.5 20 19.6046 20 18.5V14.5C20 13.9477 19.5523 13.5 19 13.5V11.5C20.6569 11.5 22 12.8431 22 14.5V18.5C22 20.7091 20.2091 22.5 18 22.5H6C3.79086 22.5 2 20.7091 2 18.5V14.5C2 12.8431 3.34315 11.5 5 11.5V13.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9.5C18 12.8137 15.3137 15.5 12 15.5C8.68629 15.5 6 12.8137 6 9.5C6 6.18629 8.68629 3.5 12 3.5C15.3137 3.5 18 6.18629 18 9.5ZM17.2544 15.5327C18.9368 14.0661 20 11.9072 20 9.5C20 5.08172 16.4183 1.5 12 1.5C7.58172 1.5 4 5.08172 4 9.5C4 11.9072 5.06318 14.0661 6.74558 15.5327C6.31652 15.6452 6 16.0356 6 16.5C6 17.0523 6.44772 17.5 7 17.5H12H17C17.5523 17.5 18 17.0523 18 16.5C18 16.0356 17.6835 15.6452 17.2544 15.5327Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GovernanceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 13.5C4.44772 13.5 4 13.9477 4 14.5V18.5C4 19.6046 4.89543 20.5 6 20.5H18C19.1046 20.5 20 19.6046 20 18.5V14.5C20 13.9477 19.5523 13.5 19 13.5V11.5C20.6569 11.5 22 12.8431 22 14.5V18.5C22 20.7091 20.2091 22.5 18 22.5H6C3.79086 22.5 2 20.7091 2 18.5V14.5C2 12.8431 3.34315 11.5 5 11.5V13.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 16.5C5 15.9477 5.52233 15.5 6.16667 15.5H17.8333C18.4777 15.5 19 15.9477 19 16.5C19 17.0523 18.4777 17.5 17.8333 17.5H6.16667C5.52233 17.5 5 17.0523 5 16.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3.5H8C7.44772 3.5 7 3.94772 7 4.5V15.5H17V4.5C17 3.94772 16.5523 3.5 16 3.5ZM8 1.5C6.34315 1.5 5 2.84315 5 4.5V17.5H19V4.5C19 2.84315 17.6569 1.5 16 1.5H8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2071 7.04289C15.5976 7.43342 15.5976 8.06658 15.2071 8.45711L11.9899 11.6743C11.4432 12.221 10.5568 12.221 10.0101 11.6743L8.79289 10.4571C8.40237 10.0666 8.40237 9.43342 8.79289 9.04289C9.18342 8.65237 9.81658 8.65237 10.2071 9.04289L11 9.83579L13.7929 7.04289C14.1834 6.65237 14.8166 6.65237 15.2071 7.04289Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LedgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9983 1.825C9.14034 1.825 6.82332 4.14202 6.82332 7V8.49167H6.16499C4.68758 8.49167 3.48999 9.68926 3.48999 11.1667V19.5C3.48999 20.9774 4.68758 22.175 6.16499 22.175H17.8317C19.3091 22.175 20.5067 20.9774 20.5067 19.5V11.1667C20.5067 9.68926 19.3091 8.49167 17.8317 8.49167H17.1733V7C17.1733 4.14202 14.8563 1.825 11.9983 1.825ZM8.83999 7C8.83999 5.2557 10.254 3.84167 11.9983 3.84167C13.7426 3.84167 15.1567 5.2557 15.1567 7V8.49167H8.83999V7ZM5.50666 11.1667C5.50666 10.8031 5.80145 10.5083 6.16499 10.5083H17.8317C18.1952 10.5083 18.49 10.8031 18.49 11.1667V19.5C18.49 19.8635 18.1952 20.1583 17.8317 20.1583H6.16499C5.80145 20.1583 5.50666 19.8635 5.50666 19.5V11.1667ZM11.9983 12.6583C11.7579 12.6583 11.5087 12.7756 11.3224 12.9495C11.1343 13.1249 10.99 13.3769 10.99 13.6667V17C10.99 17.5568 11.4415 18.0083 11.9983 18.0083C12.2387 18.0083 12.4879 17.891 12.6743 17.7172C12.8623 17.5418 13.0067 17.2898 13.0067 17V13.6667C13.0067 13.1098 12.5552 12.6583 11.9983 12.6583Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MpcIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C10.2626 4 8.91669 5.34913 8.91669 6.9375C8.91669 8.52587 10.2626 9.875 12 9.875C13.7375 9.875 15.0834 8.52587 15.0834 6.9375C15.0834 5.34913 13.7375 4 12 4ZM6.91669 6.9375C6.91669 4.17663 9.22716 2 12 2C14.7729 2 17.0834 4.17663 17.0834 6.9375C17.0834 9.69837 14.7729 11.875 12 11.875C9.22716 11.875 6.91669 9.69837 6.91669 6.9375ZM14.6255 15.2151C12.8861 14.9283 11.1139 14.9283 9.37449 15.2151L9.16672 15.2493L9.00404 14.2627L9.16671 15.2493C7.36598 15.5462 6 17.1642 6 19.1115C6 19.6331 6.40116 20 6.82813 20H17.1719C17.5988 20 18 19.6331 18 19.1115C18 17.1642 16.634 15.5462 14.8333 15.2493L14.6255 15.2151ZM9.04915 13.2417C11.004 12.9194 12.996 12.9194 14.9508 13.2417L15.1586 13.276C17.9713 13.7397 20 16.2326 20 19.1115C20 20.6759 18.7642 22 17.1719 22H6.82813C5.2358 22 4 20.6759 4 19.1115C4 16.2326 6.02867 13.7397 8.84136 13.276L9.04914 13.2417L9.21182 14.2284L9.04915 13.2417Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeroBlock() {
  const posthog = usePostHog();

  const { appStoreLink, playMarketLink } = useMemo(() => {
    const distinctId = posthog.get_distinct_id();

    if (!distinctId) {
      return {
        appStoreLink: null,
        playMarketLink: null,
      };
    }

    return {
      appStoreLink: getDynamicLink(
        'https://haqq.network/wallet',
        distinctId,
        'https://apps.apple.com/app/haqq-wallet-by-bored-gen/id6443843352',
      ),
      playMarketLink: getDynamicLink(
        'https://haqq.network/wallet',
        distinctId,
        'https://play.google.com/store/apps/details?id=com.haqq.wallet',
      ),
    };
  }, [posthog]);

  return (
    <section className="w-full py-[40px] sm:py-[70px]">
      <div className="container mx-auto flex flex-col items-center px-[20px] sm:px-[40px] lg:flex-row">
        <div className="text-center lg:w-3/5 lg:flex-row lg:text-start">
          <h1
            className={clsx(
              'font-messiri',
              'text-[48px] font-bold leading-[62px] sm:mb-[16px] sm:text-[84px] lg:leading-[100px]',
            )}
          >
            HAQQ Wallet
          </h1>
          <CardText className="mb-[30px] text-white/50">
            The best way to hold Islamic Coin and remain Shariah-compliant along
            the way!
          </CardText>

          <div className="mb-[38px] text-center lg:text-left">
            <FeatureText>
              <div className="mb-[-6px] mr-[6px] inline-block">
                <ShieldIcon />
              </div>
              Non-custodial wallet for the HAQQ Ecosystem
            </FeatureText>
            <FeatureText>
              <div className="mb-[-6px] mr-[6px] inline-block">
                <StakingIcon />
              </div>
              <span>Staking</span>
            </FeatureText>
            <br className="hidden sm:block lg:hidden" />
            <FeatureText>
              <div className="mb-[-6px] mr-[6px] inline-block">
                <GovernanceIcon />
              </div>
              <span>Governance</span>
            </FeatureText>
            <FeatureText>
              <div className="mb-[-6px] mr-[6px] inline-block">
                <LedgerIcon />
              </div>
              <span>Ledger integration</span>
            </FeatureText>
            <FeatureText>
              <div className="mb-[-6px] mr-[6px] inline-block">
                <MpcIcon />
              </div>
              <span>Mnemonic-free private key security</span>
            </FeatureText>
          </div>

          <div className="mb-[60px]">
            <div className="flex flex-col space-y-[16px] md:hidden">
              <div className="flex flex-col flex-wrap items-center justify-center space-y-[16px] sm:flex-row sm:justify-center sm:space-x-[16px] sm:space-y-0 lg:justify-start">
                {appStoreLink && (
                  <Link
                    href={appStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-attr="download-ios"
                  >
                    <WalletDownloadButton type="apple" isAvailable />
                  </Link>
                )}
                {playMarketLink && (
                  <Link
                    href={playMarketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-attr="download-android"
                  >
                    <WalletDownloadButton type="google" isAvailable />
                  </Link>
                )}
              </div>
              <div>
                <Link
                  href="https://github.com/haqq-network/haqq-wallet/releases/latest/download/haqq.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  data-attr="download-apk"
                  download
                >
                  <WalletDownloadButton type="apk" isAvailable />
                </Link>
              </div>
            </div>

            <div className="hidden flex-shrink-0 flex-row flex-wrap justify-center gap-[16px] md:flex lg:justify-start">
              {appStoreLink && (
                <div className="leading-[0px]">
                  <Link
                    href={appStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    data-attr="download-ios"
                  >
                    <WalletDownloadWithQrButton
                      link={appStoreLink}
                      type="apple"
                    />
                  </Link>
                </div>
              )}
              {playMarketLink && (
                <div className="leading-[0px]">
                  <Link
                    href={playMarketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    data-attr="download-android"
                  >
                    <WalletDownloadWithQrButton
                      link={playMarketLink}
                      type="google"
                    />
                  </Link>
                </div>
              )}
              <div className="leading-[0px]">
                <Link
                  href="https://github.com/haqq-network/haqq-wallet/releases/latest/download/haqq.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  data-attr="download-apk"
                  download
                >
                  <WalletDownloadButton type="apk" isAvailable />
                </Link>
              </div>
            </div>

            <div className="mt-[24px] text-[14px] leading-[20px]">
              You can find more supported wallets{' '}
              <Link
                href="https://docs.haqq.network/user-guides/wallet/"
                target="__blank"
                className="cursor-pointer underline transition-colors duration-150 ease-out hover:text-white/75"
              >
                here
              </Link>
              .
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <Image
            alt="HAQQ Wallet"
            src={iphoneWalletScreenshotData}
            className="max-w-[400px]"
          />
        </div>
      </div>
    </section>
  );
}
