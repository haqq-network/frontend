import { Text, HeroHeading, Button } from '@haqq/website-ui-kit';
import Image from 'next/image';
import sunriseImageData from '../../assets/images/sunrise.png';
import halfEclipseImageData from '../../assets/images/half-eclipse.png';
import Link from 'next/link';

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
    <div className="border-haqq-border relative border-b">
      <div className="border-haqq-border z-10 flex min-h-[440px] flex-col items-start justify-center px-[16px] sm:ml-[63px] sm:min-h-[610px] sm:border-l sm:pl-[20px] sm:pr-[64px] lg:ml-[79px] lg:min-h-[748px] lg:pl-[32px] lg:pr-[80px] xl:min-h-[calc(100vh-73px)]">
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
              Islamic Coin is a native currency of HAQQ Network.
            </Text>
          </p>
        </div>
        <div className="mt-[32px] lg:mt-[48px]">
          <Link
            href={'https://islamiccoin.net/'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant={2}>Islamic Coin</Button>
          </Link>
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
