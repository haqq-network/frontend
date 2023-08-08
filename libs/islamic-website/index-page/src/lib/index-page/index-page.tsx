import Image from 'next/image';
import { HeroBlock } from '../hero-block/hero-block';
import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { LearnAndGrowBlock } from '../learn-and-grow-block/learn-and-grow-block';
import { NewsBlock } from '../news-block/news-block';
import { PortfolioBlock } from '../portfolio-block/portfolio-block';
import { WhyBlock } from '../why-block/why-block';
import { Fragment, PropsWithChildren } from 'react';
import { Marquee } from '../marquee/marquee';
import { Container } from '@haqq/islamic-ui-kit';
import moonBgImageData from '../../assets/images/moon_2x.webp';
import { FinanceBlock } from '../finance-block/finance-block';
import { AdvisoryBoardBlock } from '../advisory-block/advisory-block';
import cubeOnRockImgData from '../../assets/images/cube-on-rock.webp';

const RUNNING_TEXT =
  "Our mission is to empower the world's Muslim community with a financial instrument for the Digital Age, that enables seamless transactions and interaction, while supporting innovation and philanthropy.";

const mockNews = [
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
  {
    date: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title:
      'News Title News TitleNews TitleNews TitleNews TitleNews TitleNews TitleNews Title',
    image: {
      height: 300,
      width: 200,
      src: 'https://picsum.photos/200/300',
    },
    source: 'mockwebsite.com',
  },
];

export function IndexPage() {
  return (
    <Fragment>
      <HeroBg>
        <HeroBlock />
        <Marquee className="my-[20px] mb-[80px] mt-[60px] md:mt-[120px] lg:my-[100px] lg:mt-[150px]">
          {RUNNING_TEXT.toLocaleUpperCase()}
        </Marquee>
        <WhyBlock />
      </HeroBg>
      <div className="relative overflow-clip pb-[108px] pt-[250px] md:pb-[200px] md:pt-[160px] lg:pb-[140px]">
        <div className="absolute left-1/2 h-[385px] w-[656px] translate-x-[-60%] translate-y-[-60%] scale-[80%] transform md:left-auto md:right-0 md:h-[499px] md:translate-x-[29%] md:translate-y-[-10%] md:scale-100 lg:h-[550px] lg:translate-x-[-1%] lg:translate-y-[0%] min-[1440px]:translate-x-[-23%]">
          <Image src={cubeOnRockImgData} alt="" />
        </div>
        <FinanceBlock />
      </div>
      <AdvisoryBoardBlock />
      <PortfolioBlock />
      <LearnAndGrowBlock />
      <NewsBlock news={mockNews} />
      <JoinCommunityBlock />
    </Fragment>
  );
}

function HeroBg({ children }: PropsWithChildren) {
  return (
    <div className="relative">
      <Container className="relative">
        <div className="absolute -z-10 select-none md:translate-y-[-30%]">
          <div className="absolute bottom-0 left-0 top-0 z-10 w-full bg-gradient-to-r from-[#010304] from-10% to-transparent" />
          <Image
            src={moonBgImageData}
            alt=""
            style={{
              width: '100%',
              height: 'auto',
            }}
            width={2878}
            height={2802}
            className="pointer-events-none"
          />
        </div>
      </Container>
      {children}
    </div>
  );
}
