import { Heading, Text } from '@haqq/website-ui-kit';
import Link from 'next/link';

export function TextBlock() {
  return (
    <section className="border-b border-t border-white/20 px-[16px] py-[60px] sm:px-[48px] sm:py-[80px] lg:px-[110px] lg:py-[100px] xl:px-[320px]">
      <div className="flex flex-col gap-y-[20px] sm:gap-y-[24px]">
        <Heading>
          Introducing the HAQQ Ecosystem Fund: An Opportunity to Grow with HAQQ
          Blockchain
        </Heading>
        <Text>
          HAQQ Association is proud to announce the launch of the HAQQ Ecosystem
          Fund, a grants and investment program designed to support the growth
          of HAQQ Network and Islamic Coin. With a total allocation of $40M
          ($20M USDC and USDT + $20M Islamic Coin), the HAQQ Ecosystem Fund
          represents our commitment to promoting global adoption of HAQQ
          Blockchain and Islamic Coin.
        </Text>
        <Text>
          The funds will be directed towards various initiatives, including
          development, marketing, bug bounties, and other ventures aimed at
          improving the HAQQ Ecosystem's growth. Our grants and investments
          undergo a stringent ethics and Shariah assessment to ensure that every
          project funded aligns with our Islamic values and is ethical in its
          general sense.
        </Text>
        <Text>
          At HAQQ Association, we prioritize projects that are building on HAQQ
          Network from scratch, mature projects willing to expand their services
          to the HAQQ Network, and individual developers willing to contribute
          to the core HAQQ infrastructure products such as{' '}
          <Link href={'/wallet'} className="text-haqq-orange">
            HAQQ Wallet
          </Link>
          ,{' '}
          <Link href={'https://docs.haqq.network'} className="text-haqq-orange">
            HAQQ Node
          </Link>
          ,{' '}
          <Link
            href={'https://shell.haqq.network'}
            target="_blank"
            rel={'noopener noreferrer'}
            className="text-haqq-orange"
          >
            HAQQ Shell
          </Link>
          . This focus on web3 projects will ensure that the HAQQ Ecosystem
          remains at the forefront of blockchain technology, serving as a hub
          for innovative projects and technologies.
        </Text>
        <Text>
          Our team is excited to work with like-minded individuals, whether you
          are a fintech startup or a community benefit project. With the HAQQ
          Ecosystem Fund, we have the opportunity to create a positive impact,
          driving growth and innovation that aligns with our shared Islamic
          values.
        </Text>
      </div>
    </section>
  );
}
