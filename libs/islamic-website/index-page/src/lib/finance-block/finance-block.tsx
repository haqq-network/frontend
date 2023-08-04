import { Container, GradientText, Text } from '@haqq/islamic-ui-kit';
import Image from 'next/image';
import cubeOnRockImgData from '../../assets/images/cube-on-rock.webp';

export function FinanceBlock() {
  return (
    <Container className="mt-[80px] overflow-hidden pb-[50px] pt-[300px] md:mt-0 md:overflow-visible lg:mt-[160px] lg:pb-0 lg:pt-0">
      <div className="relative flex text-white">
        <div className="flex flex-col md:w-4/5 lg:w-3/5 lg:py-[12px] xl:py-[60px]">
          <div className="text-[28px] font-[600] leading-[32px] md:text-[44px] md:leading-[48px] lg:text-[64px] lg:leading-[70px]">
            Pioneering the Future{' '}
            <GradientText>of Islamic Finance</GradientText>
          </div>
          <div className="mt-[40px]">
            <Text isMono>
              Crypto Innovation Meets Islamic Tradition offering Interest-Free
              Investments, Halal Trading, and Charitable Giving
            </Text>
          </div>
          <div className="mt-[32px]">
            <Text size="small" className="text-white/50">
              Our Shariah compliant products, including interest-free
              investments, halal trading, and charitable giving opportunities,
              blend modern fintech with Islamic heritage, giving you the power
              to honor your traditions while embracing the crypto revolution.
              Step into the future with Islamic Coin - the heart of ethical,
              principled finance that respects your values.
            </Text>
          </div>
        </div>
        <div className="absolute right-[22%] top-[-315px] z-[-1] w-[656px] translate-x-[24%] md:-top-1/2 md:right-0 md:translate-x-0 lg:right-0 lg:top-0 lg:h-[550px]">
          <Image src={cubeOnRockImgData} alt="" />
        </div>
      </div>
    </Container>
  );
}
