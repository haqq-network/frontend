import {
  Container,
  Text,
  RatingBadge,
  WalletDownloadButton,
} from '@haqq/islamic-ui-kit';
import Link from 'next/link';

export function WalletPage() {
  return (
    <Container className="mt-[32px] flex flex-col pb-[60px] text-white md:mt-[52px] lg:mt-[68px]">
      <Text className="text-[46px] font-[600] leading-[52px] md:text-[80px] md:leading-none lg:text-[80px] lg:leading-none">
        <span className="bg-gradient-to-r from-[#36FFF3] to-[#18FFAC] bg-clip-text text-transparent">
          Wallets
        </span>{' '}
        for iOS and Android
      </Text>
      <Text isMono className="mt-[24px] md:mt-[40px]">
        Ethics-First, Non-Custodial Wallet
      </Text>
      <div className="mt-[20px] text-[13px] md:mt-[24px] md:text-[16px] md:text-[#F5F5F580]">
        Seamlessly navigate Web3 with HAQQ Wallet, your trusted partner for a
        principled DeFi journey. With mnemonicless security and a user-friendly
        interface, managing your digital Shariah-compliant assets has never been
        easier or more secure
      </div>
      <div className="mt-[24px] flex gap-x-[24px] md:mt-[36px] md:gap-x-[38px]">
        <RatingBadge market="app-store" rating={4.5} />
        <RatingBadge market="google-play" rating={5.0} />
      </div>
      <div className="mt-[28px] flex flex-col gap-x-[16px] gap-y-[20px] lg:mt-[24px] lg:flex-row">
        <div className="w-fit">
          <Link
            href="https://apps.apple.com/app/haqq-wallet-by-bored-gen/id6443843352"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WalletDownloadButton type="apple" />
          </Link>
        </div>
        <div className="w-fit">
          <Link
            href="https://play.google.com/store/apps/details?id=com.haqq.wallet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WalletDownloadButton type="google" />
          </Link>
        </div>
      </div>
    </Container>
  );
}
