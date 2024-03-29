import Image from 'next/image';
import Link from 'next/link';
import { Container, IslamicLogoIcon, Text } from '@haqq/islamic-website-ui-kit';
// import bitgetLogoImageData from '../../assets/images/bitget.svg';
import kucoinLogoImageData from '../../assets/images/kucoin.svg';
import lbankLogoImageData from '../../assets/images/lbank.png';
import mexcLogoImageData from '../../assets/images/mexc.svg';
import osmosisLogoImageData from '../../assets/images/osmosis.svg';
import bgPageImageData from '../../assets/images/page-background.svg';
import sushiLogoImageData from '../../assets/images/sushi.svg';
import xtLogoImageData from '../../assets/images/xt.svg';
import { CEXCard } from '../cex-card/cex-card';
import { DEXBlock } from '../dex-block/dex-block';
import { DEXCard } from '../dex-card/dex-card';
import { OnamperCard } from '../onramper-card/onramper-card';

const dexData: Array<{
  name: string;
  logo: string;
  pools: Array<{ pair: [string, string]; href: string }>;
}> = [
  {
    name: 'SUSHI',
    logo: sushiLogoImageData,
    pools: [
      {
        pair: ['USDT', 'ISLM'],
        href: 'https://www.sushi.com/swap?chainId=11235&token0=0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75&token1=NATIVE',
      },
      {
        pair: ['USDC', 'ISLM'],
        href: 'https://www.sushi.com/swap?chainId=11235&token0=0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd&token1=NATIVE',
      },
      {
        pair: ['wETH', 'ISLM'],
        href: 'https://www.sushi.com/swap?chainId=11235&token0=0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265&token1=NATIVE',
      },
      {
        pair: ['DAI', 'ISLM'],
        href: 'https://www.sushi.com/swap?chainId=11235&token0=0xC5e00D3b04563950941f7137B5AfA3a534F0D6d6&token1=NATIVE',
      },
      {
        pair: ['wBTC', 'ISLM'],
        href: 'https://www.sushi.com/swap?chainId=11235&token0=0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687&token1=NATIVE',
      },
    ],
  },
  {
    name: 'OSMOSIS',
    logo: osmosisLogoImageData,
    pools: [
      {
        pair: ['USDT', 'ISLM'],
        href: 'https://app.osmosis.zone/?to=ISLM&from=USDT',
      },
      {
        pair: ['USDC', 'ISLM'],
        href: 'https://app.osmosis.zone/?to=ISLM&from=USDC',
      },
      {
        pair: ['ATOM', 'ISLM'],
        href: 'https://app.osmosis.zone/?to=ISLM&from=ATOM',
      },
      {
        pair: ['OSMO', 'ISLM'],
        href: 'https://app.osmosis.zone/?to=ISLM&from=OSMO',
      },
      {
        pair: ['INJ', 'ISLM'],
        href: 'https://app.osmosis.zone/?to=ISLM&from=INJ',
      },
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
                Where to buy
              </h1>
              <div className="mt-[28px] flex flex-row items-center gap-x-[12px] md:mt-[44px] md:gap-x-[24px] lg:mt-[60px]">
                <div className="h-[24px] w-[24px] rounded-[6px] bg-[#04D484] p-[4px] md:h-[54px] md:w-[54px] md:rounded-[20px] md:p-[9px]">
                  <IslamicLogoIcon className="h-[16px] w-[16px] md:h-[36px] md:w-[36px]" />
                </div>
                <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
                  Price:&nbsp;{price}
                </h2>
              </div>
            </div>

            <div>
              <div>
                <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
                  CEX
                </h2>
                <div className="mt-[12px] md:mt-[18px]">
                  <Text>
                    A list of exchanges where you can purchase and exchange
                    Islamic Coin
                  </Text>
                </div>
              </div>

              <div className="mt-[24px] grid grid-cols-2 gap-[16px] md:mt-[40px] md:grid-cols-2 md:gap-[24px] lg:grid-cols-3 xl:gap-[36px]">
                <Link
                  href="https://www.kucoin.com/trade/ISLM-USDT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CEXCard name="kuCoin" logo={kucoinLogoImageData} />
                </Link>
                {/* <Link
                  href="https://www.bitget.com/spot/ISLMUSDT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CEXCard name="BitGet" logo={bitgetLogoImageData} />
                </Link> */}
                <Link
                  href="https://www.lbank.com/trade/islm_usdt/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CEXCard name="LBank" logo={lbankLogoImageData} />
                </Link>
                <Link
                  href="https://www.xt.com/en/trade/islm_usdt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CEXCard name="XT.com" logo={xtLogoImageData} />
                </Link>
                <Link
                  href="https://www.mexc.com/exchange/ISLM_USDT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CEXCard name="MEXC" logo={mexcLogoImageData} />
                </Link>
              </div>
            </div>

            <div>
              <div>
                <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
                  DEX
                </h2>

                <div className="mt-[12px] md:mt-[18px]">
                  <Text>
                    List of dex platforms where you can swap Islamic Coin
                  </Text>
                </div>
              </div>

              <div className="mt-[24px] flex flex-col gap-[28px] md:mt-[40px] md:gap-[40px]">
                {dexData.map((dex, index) => {
                  return (
                    <DEXBlock
                      name={dex.name}
                      logo={dex.logo}
                      key={`dex-${index}`}
                    >
                      {dex.pools.map((pool) => {
                        return (
                          <Link
                            key={pool.pair.join('_')}
                            href={pool.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
                  Fiat
                </h2>
                <div className="mt-[12px] md:mt-[18px]">
                  <Text>Buying Islamic Coin for fiat currency</Text>
                </div>
              </div>

              <div className="mt-[24px] grid grid-cols-1 gap-[16px] md:mt-[40px] md:grid-cols-2 md:gap-[24px] lg:grid-cols-3 xl:gap-[36px]">
                <Link
                  href="https://buy.onramper.com/?apiKey=pk_prod_01HD0SSHKR1BYWAH09NWZCXVFS&mode=buy&onlyCryptos=islm&onlyCryptoNetworks=haqq"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OnamperCard />
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
                Disclaimer
              </h2>
              <div className="mt-[16px] flex flex-col gap-[16px] md:mt-[20px] md:gap-[24px] lg:mt-[24px]">
                <p>
                  <Text>
                    The availability of Islamic Coin (ISLM) tokens, including
                    the venues and methods of payment, may vary depending on the
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
