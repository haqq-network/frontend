import Image from 'next/image';
import Link from 'next/link';
import { Container, Heading, Text } from '@haqq/islamic-website-ui-kit';
import bitgetLogoImageData from '../../assets/images/bitget.svg';
import kucoinLogoImageData from '../../assets/images/kucoin.svg';
import lbankLogoImageData from '../../assets/images/lbank.png';
import osmosisLogoImageData from '../../assets/images/osmosis.svg';
import bgPageImageData from '../../assets/images/page-background.svg';
import sushiLogoImageData from '../../assets/images/sushi.svg';
import { CEXCard } from '../cex-card/cex-card';
import { DEXBlock } from '../dex-block/dex-block';
import { DEXCard } from '../dex-card/dex-card';
import { OnamperCard } from '../onramper-card/onramper-card';

const mock: Array<{
  name: string;
  logo: string;
  pools: Array<{ pair: [string, string]; href: string }>;
}> = [
  {
    name: 'SUSHI',
    logo: sushiLogoImageData,
    pools: [
      { pair: ['USDT', 'ISLM'], href: '#swap_usdt_islm' },
      { pair: ['USDC', 'ISLM'], href: '#swap_usdc_islm' },
      { pair: ['wETH', 'ISLM'], href: '#swap_weth_islm' },
      { pair: ['DAI', 'ISLM'], href: '#swap_dai_islm' },
      { pair: ['wBTC', 'ISLM'], href: '#swap_ubtc_islm' },
    ],
  },
  {
    name: 'OSMOSIS',
    logo: osmosisLogoImageData,
    pools: [
      { pair: ['USDT', 'ISLM'], href: '#swap_usdt_islm' },
      { pair: ['USDC', 'ISLM'], href: '#swap_usdc_islm' },
      { pair: ['ATOM', 'ISLM'], href: '#swap_atom_islm' },
      { pair: ['OSMO', 'ISLM'], href: '#swap_osmo_islm' },
      { pair: ['INJ', 'ISLM'], href: '#swap_inj_islm' },
    ],
  },
];

export function MarketsPage({ price }: { price: string }) {
  return (
    <section className="overflow-clip">
      <Container className="relative">
        <BgImage />
        <div className="pb-[60px] pt-[32px] lg:pb-[140px] lg:pt-[80px]">
          <div className="flex flex-col gap-[48px] md:gap-[100px]">
            <div>
              <h1 className="whitespace-pre-line text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
                Islamic <br className="block md:hidden" />
                Markets
              </h1>

              <Heading
                level={3}
                className="mt-[28px] md:mt-[44px] lg:mt-[60px]"
              >
                Price:&nbsp;{price}
              </Heading>
            </div>

            <div>
              <div>
                <Heading level={3}>CEX</Heading>
                <div className="mt-[12px] md:mt-[18px]">
                  <Text>
                    A list of exchanges where you can purchase and exchange
                    IslamicCoin
                  </Text>
                </div>
              </div>

              <div className="mt-[24px] grid grid-cols-2 gap-[16px] md:mt-[40px] md:grid-cols-2 md:gap-[36px] lg:grid-cols-3">
                <Link href="#">
                  <CEXCard name="kuCoin" logo={kucoinLogoImageData} />
                </Link>
                <Link href="#">
                  <CEXCard name="BitGet" logo={bitgetLogoImageData} />
                </Link>
                <Link href="#">
                  <CEXCard name="LBank" logo={lbankLogoImageData} />
                </Link>
              </div>
            </div>

            <div>
              <div>
                <Heading level={3}>DEX</Heading>
                <div className="mt-[12px] md:mt-[18px]">
                  <Text>
                    List of dex platforms where you can swap IslamicCoin
                  </Text>
                </div>
              </div>

              <div className="mt-[24px] flex flex-col gap-[28px] md:mt-[40px] md:gap-[40px]">
                {mock.map((dex, index) => {
                  return (
                    <DEXBlock
                      name={dex.name}
                      logo={dex.logo}
                      key={`dex-${index}`}
                    >
                      {dex.pools.map((pool) => {
                        return (
                          <Link key={pool.pair.join('_')} href={pool.href}>
                            <DEXCard pair={pool.pair} />
                          </Link>
                        );
                      })}
                    </DEXBlock>
                  );
                })}
              </div>
            </div>

            <div>
              <div>
                <Heading level={3}>OnRamp</Heading>
                <div className="mt-[12px] md:mt-[18px]">
                  <Text>Buying IslamicCoin for fiat currency</Text>
                </div>
              </div>

              <div className="mt-[24px] grid grid-cols-1 gap-[16px] md:mt-[40px] md:grid-cols-3 md:gap-[36px]">
                <Link href="#">
                  <OnamperCard />
                </Link>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-[8px]">
                <div>
                  <Heading level={4}>Disclaimer</Heading>
                </div>
                <p>
                  <Text>
                    The availability of IslamicCoin (ISLM) tokens, including the
                    venues and methods of payment, may vary depending on the
                    purchaser's residency and/or citizenship. We expressly
                    highlight that residents of Dubai are currently restricted
                    from purchasing ISLM tokens.
                  </Text>
                </p>
                <p>
                  <Text>
                    We encourage all potential purchasers to review their local
                    regulations and restrictions before attempting to acquire
                    ISLM tokens.
                  </Text>
                </p>
                <p>
                  <Text>
                    This notice serves to inform and does not constitute legal
                    advice. Please consult with a legal advisor if you are
                    uncertain about your eligibility to purchase ISLM tokens
                    based on your location or citizenship status.
                  </Text>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BgImage() {
  return (
    <div className="absolute right-[-160px] z-[-1] h-[723.45px] w-[488.48px] opacity-60 md:right-[-100px] md:top-[80px] md:opacity-100">
      <Image src={bgPageImageData} fill alt="" />
    </div>
  );
}
