import { GradientText, Text, WalletDownloadButton } from '@haqq/islamic-ui-kit';
import iphoneImgData from '../../assets/images/iphone.png';
import halfIphoneImgData from '../../assets/images/half-iphone.png';
import Image from 'next/image';
import Link from 'next/link';

interface RatingBadgeProps {
  market: 'app-store' | 'google-play';
  rating: 4.5 | 5;
}

function HalfGoldenStar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_139_14250)">
        <g opacity="0.5">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.69134 1.77659C8.44156 1.18515 7.56104 1.18515 7.31127 1.77659L5.86752 5.19527C5.76115 5.44713 5.51256 5.61887 5.22779 5.63724L1.36236 5.88646C0.693626 5.92958 0.421531 6.72587 0.935898 7.13453L3.90903 9.49661C4.12807 9.67063 4.22303 9.94851 4.15339 10.2117L3.20818 13.7844C3.04465 14.4025 3.75701 14.8947 4.32468 14.5558L7.60593 12.5969C7.84767 12.4526 8.15494 12.4526 8.39668 12.5969L11.6779 14.5558C12.2456 14.8947 12.958 14.4025 12.7944 13.7844L11.8492 10.2117C11.7796 9.94851 11.8745 9.67063 12.0936 9.49661L15.0667 7.13452C15.5811 6.72587 15.309 5.92958 14.6402 5.88646L10.7748 5.63724C10.49 5.61887 10.2415 5.44713 10.1351 5.19527L8.69134 1.77659Z"
            fill="#848484"
          />
        </g>
        <g clip-path="url(#clip1_139_14250)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.69134 1.77659C8.44156 1.18515 7.56104 1.18515 7.31127 1.77659L5.86752 5.19527C5.76115 5.44713 5.51256 5.61887 5.22779 5.63724L1.36236 5.88646C0.693626 5.92958 0.421531 6.72587 0.935898 7.13453L3.90903 9.49661C4.12807 9.67063 4.22303 9.94851 4.15339 10.2117L3.20818 13.7844C3.04465 14.4025 3.75701 14.8947 4.32468 14.5558L7.60593 12.5969C7.84767 12.4526 8.15494 12.4526 8.39668 12.5969L11.6779 14.5558C12.2456 14.8947 12.958 14.4025 12.7944 13.7844L11.8492 10.2117C11.7796 9.94851 11.8745 9.67063 12.0936 9.49661L15.0667 7.13452C15.5811 6.72587 15.309 5.92958 14.6402 5.88646L10.7748 5.63724C10.49 5.61887 10.2415 5.44713 10.1351 5.19527L8.69134 1.77659Z"
            fill="#FCC310"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_139_14250">
          <rect width="16" height="16" fill="white" />
        </clipPath>
        <clipPath id="clip1_139_14250">
          <rect width="8" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function GoldenStar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.69134 1.77684C8.44156 1.18539 7.56104 1.18539 7.31127 1.77684L5.86752 5.19551C5.76115 5.44738 5.51256 5.61912 5.22779 5.63748L1.36236 5.8867C0.693626 5.92982 0.421531 6.72612 0.935898 7.13477L3.90903 9.49685C4.12807 9.67087 4.22303 9.94876 4.15339 10.212L3.20818 13.7847C3.04465 14.4028 3.75701 14.8949 4.32468 14.556L7.60593 12.5972C7.84767 12.4529 8.15494 12.4529 8.39668 12.5972L11.6779 14.556C12.2456 14.8949 12.958 14.4028 12.7944 13.7847L11.8492 10.212C11.7796 9.94876 11.8745 9.67087 12.0936 9.49685L15.0667 7.13477C15.5811 6.72612 15.309 5.92982 14.6402 5.8867L10.7748 5.63748C10.49 5.61912 10.2415 5.44738 10.1351 5.19551L8.69134 1.77684Z"
        fill="#FCC310"
      />
    </svg>
  );
}

function RatingBadge({ market, rating }: RatingBadgeProps) {
  return (
    <div className="flex flex-col gap-y-[6px]">
      <span className="font-mono text-[10px] uppercase leading-[16px] text-white/50">
        {market === 'app-store' && 'App store rating'}
        {market === 'google-play' && 'Google play rating'}
      </span>
      <div className="flex items-center gap-x-[10px]">
        <div className="flex gap-x-[4px]">
          <GoldenStar />
          <GoldenStar />
          <GoldenStar />
          <GoldenStar />
          {rating === 5 && <GoldenStar />}
          {rating === 4.5 && <HalfGoldenStar />}
        </div>
        <Text className="text-[#FCC310]" isMono>
          {rating === 5 && '5.0'}
          {rating === 4.5 && '4.5'}
        </Text>
      </div>
    </div>
  );
}

export function PortfolioBlock() {
  return (
    <div className="flex flex-col gap-y-[32px] text-white">
      <div className="block text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:hidden lg:text-[64px] lg:leading-[70px]">
        Manage Your <GradientText>Shariah Portfolio </GradientText>
        with HAQQ Wallet
      </div>
      <div className="flex flex-col gap-x-[28px] gap-y-[32px] md:flex-row-reverse">
        <div className="bg-islamic-primary-graphite relative block h-[290px] overflow-hidden rounded-[20px] px-[42px] pt-[24px] md:hidden md:h-full md:px-[10px] md:pt-[32px]">
          <Image
            src={halfIphoneImgData}
            alt=""
            className="absolute left-1/2 top-[24px] w-[258px] translate-x-[-50%] translate-y-0 transform"
          />
        </div>
        <div className="flex flex-col items-center justify-between md:flex-row md:gap-x-[28px]">
          <div className="flex flex-col gap-y-[20px]">
            <div className="hidden text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:block lg:text-[64px] lg:leading-[70px]">
              Manage Your <GradientText>Shariah Portfolio </GradientText>
              with HAQQ Wallet
            </div>
            <Text isMono>Ethics-First, Non-Custodial Wallet</Text>
            <Text size="small" className="text-white/50">
              Seamlessly navigate Web3 with HAQQ Wallet, your trusted partner
              for a principled DeFi journey. With mnemonicless security and a
              user-friendly interface, managing your digital Shariah-compliant
              assets has never been easier or more secure
            </Text>
            <div className="flex flex-col gap-x-[32px] gap-y-[20px] min-[375px]:flex-row">
              <RatingBadge market="app-store" rating={4.5} />
              <RatingBadge market="google-play" rating={5.0} />
            </div>
            <div className="flex flex-col gap-x-[16px] gap-y-[20px] lg:flex-row">
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
          </div>
        </div>
        <div className="bg-islamic-primary-graphite relative hidden w-1/2 overflow-hidden rounded-[20px] px-[42px] pt-[24px] md:block md:h-[480px] md:min-w-[280px] md:px-[10px] md:pt-[32px] lg:h-[648px] lg:min-w-[380px] xl:min-w-[446px] 2xl:min-w-[526px]">
          <Image
            src={iphoneImgData}
            alt=""
            className="absolute left-1/2 translate-x-[-50%] translate-y-0 transform md:w-[258px] lg:w-[348px]"
          />
        </div>
      </div>
    </div>
  );
}
