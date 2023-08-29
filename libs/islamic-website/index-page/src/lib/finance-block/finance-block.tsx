import { Container, GradientText, Text } from '@haqq/islamic-ui-kit';
import cubeOnRockImgData from '../../assets/images/cube-on-rock.webp';
import Image from 'next/image';
import clsx from 'clsx';

export function FinanceBlock() {
  return (
    <div className="mt-[86px] overflow-x-clip md:mt-[110px] lg:mt-[160px] lg:py-[60px]">
      <Container>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-8/12">
            <div className="flex flex-col">
              <h2 className="text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]">
                <span>Pioneering the Future </span>
                <br className="md:block lg:hidden" />
                <GradientText>of&nbsp;Islamic&nbsp;Finance</GradientText>
              </h2>

              <div className="mt-[24px] md:mt-[44px] lg:mt-[40px]">
                <Text isMono>
                  Crypto Innovation Meets Islamic Tradition offering
                  Interest-Free Investments, Halal Trading, and Charitable
                  Giving
                </Text>
              </div>

              <div className="mt-[20px] flex max-w-[600px] flex-col gap-y-[20px] md:mt-[38px] lg:mt-[32px] lg:gap-y-[28px]">
                <p>
                  <Text size="small" className="text-white/50">
                    Our Shariah compliant products, including interest-free
                    investments, halal trading, and charitable giving
                    opportunities, blend modern fintech with Islamic heritage,
                    giving you the power to honor your traditions while
                    embracing the crypto revolution.
                  </Text>
                </p>
                <p>
                  <Text size="small" className="text-white/50">
                    Step into the future with Islamic Coin - the heart of
                    ethical, principled finance that respects your values.
                  </Text>
                </p>
              </div>
            </div>
          </div>
          <div className="relative order-first flex-1 pt-[300px] md:order-last md:pt-[0px]">
            <div
              className={clsx(
                'absolute left-[50%] top-[50%] z-[-1] max-w-none',
                'h-[550px] w-[656px] translate-x-[-61.5%] translate-y-[-35%]',
                'md:translate-x-[-61.5%] md:translate-y-[-40%]',
                'lg:scale-125',
              )}
            >
              <Image src={cubeOnRockImgData} alt="" fill priority />
              <div className="absolute bottom-0 h-[360px] w-full bg-gradient-to-b from-[#01030400] to-[#010304]"></div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
