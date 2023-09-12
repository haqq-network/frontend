import { Button, Container, Text } from '@haqq/islamic-website-ui-kit';
import Image from 'next/image';
import careerStarsImgData from '../../assets/images/career-stars.webp';
import clsx from 'clsx';

export function CareerPage() {
  return (
    <section className="overflow-x-clip pb-[60px] pt-[32px] text-white md:pb-[140px] md:pt-[52px] lg:pt-[68px]">
      <Container className="relative">
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          Career
        </h1>

        <div className="mt-[32px] md:mt-[60px] md:max-w-[480px] lg:max-w-[600px]">
          <div className="flex flex-col gap-[16px] md:gap-[24px]">
            <p>
              <Text size="small">Welcome to Islamic Coin's careers page!</Text>
            </p>
            <p>
              <Text size="small">
                We are a passionate team of professionals committed to creating
                innovative solutions by combining the power of blockchain
                technology and the principles of Islamic finance. Our mission is
                to provide the global Muslim community with a financial
                instrument for the Digital Age, enabling seamless transactions
                and interactions while promoting innovation and philanthropy. If
                you share our values and are enthusiastic about blockchain
                technology, we invite you to explore our exciting opportunities.
              </Text>
            </p>
            <p>
              <Text size="small">
                We offer various roles that enable you to learn, grow, and make
                a meaningful impact. Join us to build a fairer, more inclusive
                financial future for all. Discover our current openings and
                apply today!
              </Text>
            </p>
          </div>

          <div className="mt-[24px] max-w-[233px] md:mt-[44px]">
            <Button>Discover openings!</Button>
          </div>
        </div>

        <div
          className={clsx(
            'absolute z-[-1]',
            'right-[-222px] top-[-50px] h-[447px] w-[444px]',
            'md:right-[-200px] md:top-[-80px] md:h-[720px] md:w-[724px]',
            'lg:right-[-340px] lg:top-[-220px] lg:h-[1000px] lg:w-[1000px]',
            'opacity-70 md:opacity-100',
          )}
        >
          <Image src={careerStarsImgData} alt="" fill />
        </div>
      </Container>
    </section>
  );
}
