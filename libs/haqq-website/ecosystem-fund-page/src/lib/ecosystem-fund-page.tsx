import { Heading, Text } from '@haqq/haqq-website-ui-kit';
import { Button } from '@haqq/haqq-website-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
// import sunshineBgData from '../assets/images/hero-block-sunrise-bg.png';
import linesBgData from '../assets/images/hero-block-bg.svg';
import linesSmallBgData from '../assets/images/hero-block-bg-small.svg';
import { EcosystemFundApplyBlock } from './ecosystem-fund-apply-block/ecosystem-fund-apply-block';

export function EcosystemFundPage() {
  return (
    <section>
      <div className="sunrise-background relative overflow-hidden px-[16px] pt-[80px] sm:px-[48px] sm:pt-[120px] lg:px-[80px]">
        <div className="relative z-10">
          <h1 className="font-serif text-[46px] font-medium uppercase leading-none sm:text-[80px] lg:text-[140px]">
            HAQQ <br /> Ecosystem <br className="block lg:hidden xl:block" />{' '}
            Fund
          </h1>

          <Link href="#apply" className="scroll-smooth" scroll={false}>
            <Button
              variant={2}
              className="mb-[80px] mt-[32px] sm:mb-[120px] sm:mt-[48px] lg:mt-[64px]"
            >
              Apply
            </Button>
          </Link>
        </div>

        {/* <Image
          alt=""
          src={sunshineBgData}
          className="absolute bottom-0 left-1/2 z-[0] w-full -translate-x-1/2 transform"
        /> */}
        <Image
          alt=""
          src={linesBgData}
          className="absolute right-[-130px] top-0 z-[-1] hidden md:right-[-210px] md:block lg:right-[-370px] xl:right-[50px]"
        />
        <Image
          alt=""
          src={linesSmallBgData}
          className="absolute right-0 top-0 z-[-1] block md:hidden"
        />
      </div>

      <div className="border-b border-t border-white/20 px-[16px] py-[60px] sm:px-[48px] sm:py-[80px] lg:px-[110px] lg:py-[100px] xl:px-[320px]">
        <div className="flex flex-col gap-y-[20px] sm:gap-y-[24px]">
          <Heading>
            Introducing the HAQQ Ecosystem Fund: An Opportunity to Grow with
            HAQQ Blockchain
          </Heading>
          <Text>
            HAQQ Association is proud to announce the launch of the HAQQ
            Ecosystem Fund, a grants and investment program designed to support
            the growth of HAQQ Network and Islamic Coin. With a total allocation
            of $40M ($20M USDC and USDT + $20M Islamic Coin), the HAQQ Ecosystem
            Fund represents our commitment to promoting global adoption of HAQQ
            Blockchain and Islamic Coin.
          </Text>
          <Text>
            The funds will be directed towards various initiatives, including
            development, marketing, bug bounties, and other ventures aimed at
            improving the HAQQ Ecosystem's growth. Our grants and investments
            undergo a stringent ethics and Shariah assessment to ensure that
            every project funded aligns with our Islamic values and is ethical
            in its general sense.
          </Text>
          <Text>
            At HAQQ Association, we prioritize projects that are building on
            HAQQ Network from scratch, mature projects willing to expand their
            services to the HAQQ Network, and individual developers willing to
            contribute to the core HAQQ infrastructure products such as{' '}
            <Link href="/wallet" className="text-haqq-orange">
              HAQQ Wallet
            </Link>
            ,{' '}
            <Link href="https://docs.haqq.network" className="text-haqq-orange">
              HAQQ Node
            </Link>
            ,{' '}
            <Link
              href="https://shell.haqq.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-haqq-orange"
            >
              HAQQ Shell
            </Link>
            . This focus on web3 projects will ensure that the HAQQ Ecosystem
            remains at the forefront of blockchain technology, serving as a hub
            for innovative projects and technologies.
          </Text>
          <Text>
            Our team is excited to work with like-minded individuals, whether
            you are a fintech startup or a community benefit project. With the
            HAQQ Ecosystem Fund, we have the opportunity to create a positive
            impact, driving growth and innovation that aligns with our shared
            Islamic values.
          </Text>
        </div>
      </div>

      <EcosystemFundApplyBlock />
    </section>
  );
}
