import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Text, HeroHeading } from '@haqq/haqq-website-ui-kit';
import halfEclipseImageData from '../../assets/images/index-page-half-eclipse.png';
import sunriseImageData from '../../assets/images/index-page-sunrise-bg.png';

function SunriseBackground() {
  return (
    <div className="absolute inset-0 z-[-1] lg:translate-y-[100px]">
      <Image
        alt=""
        src={sunriseImageData.src}
        height={sunriseImageData.height}
        width={sunriseImageData.width}
        className="absolute bottom-0 z-[-1] w-full origin-bottom scale-125"
      />
      <Image
        alt=""
        src={halfEclipseImageData.src}
        height={halfEclipseImageData.height}
        width={halfEclipseImageData.width}
        className="absolute bottom-[-2px] left-0 z-[-1] w-full"
      />
    </div>
  );
}

export function HeroBlock() {
  return (
    <div className="border-haqq-border relative overflow-x-clip border-b">
      <div
        className={clsx(
          'border-haqq-border z-10 flex flex-col items-start justify-center',
          'px-[16px] sm:ml-[63px] sm:border-l sm:pl-[20px] sm:pr-[64px]',
          'lg:ml-[79px] lg:pl-[32px] lg:pr-[80px] xl:min-h-[calc(100vh-73px)]',
          'pb-[80px] pt-[60px] sm:pb-[140px] sm:pt-[80px] xl:py-[140px]',
        )}
      >
        <HeroHeading>
          Home of <br />
          ethical web3
        </HeroHeading>
        <div className="mt-[32px] flex flex-col gap-[16px] lg:max-w-[700px]">
          <p>
            <Text size="large">
              Ethics-first network that welcomes sustainability-centered
              developers, validators and open source contributors as well as
              Muslim innovators in sustainable Finance.
            </Text>
          </p>
          <p>
            <Text size="large">
              <Link
                href="https://islamiccoin.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-haqq-orange underline transition-colors duration-150"
              >
                Islamic Coin
              </Link>{' '}
              is a native currency of HAQQ Network.
            </Text>
          </p>
        </div>
      </div>

      <div className="hidden sm:absolute sm:bottom-[26px] sm:left-[28px] sm:block lg:bottom-[58px] lg:left-[34px]">
        <svg width="10" height="39" viewBox="0 0 10 39" fill="none">
          <path
            d="M5 0L5 38.0977M5 38.0977L9.18359 34.0977M5 38.0977L1 34.0977"
            stroke="white"
          />
        </svg>
      </div>

      <SunriseBackground />
    </div>
  );
}
