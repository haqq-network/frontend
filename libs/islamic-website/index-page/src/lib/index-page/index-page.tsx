import Image from 'next/image';
import { HeroBlock } from '../hero-block/hero-block';
import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { LearnAndGrowBlock } from '../learn-and-grow-block/learn-and-grow-block';
import { NewsBlock } from '../news-block/news-block';
import { PortfolioBlock } from '../portfolio-block/portfolio-block';
import { WhyBlock } from '../why-block/why-block';
import { Fragment, PropsWithChildren } from 'react';
import { Marquee } from '../marquee/marquee';
import { Container, NewsPost } from '@haqq/islamic-ui-kit';
import moonBgImageData from '../../assets/images/moon-2x.webp';
import { FinanceBlock } from '../finance-block/finance-block';
import { AdvisoryBoardBlock } from '../advisory-block/advisory-block';

const RUNNING_TEXT =
  "Our mission is to empower the world's Muslim community with a financial instrument for the Digital Age, that enables seamless transactions and interaction, while supporting innovation and philanthropy.";

const mockNews: NewsPost[] = [
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
    type: 'events',
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
    type: 'events',
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
    type: 'press',
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
    type: 'press',
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
    type: 'events',
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
    type: 'events',
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
    type: 'press',
    isFeatured: true,
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
    type: 'press',
    isFeatured: true,
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
      <FinanceBlock />
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
    <div className="overflow-x-clip">
      <Container className="relative">
        <div className="absolute -z-10 translate-x-[-50%] translate-y-[40%] select-none md:translate-x-0 md:translate-y-[-12%] xl:translate-x-[-1.5%] xl:translate-y-[-24.5%]">
          <div className="absolute bottom-0 left-0 top-0 z-10 w-full bg-gradient-to-r from-[#010304] from-10% to-transparent lg:left-[-10%] " />
          <Image
            src={moonBgImageData}
            alt=""
            width={2878}
            height={2802}
            className="pointer-events-none scale-[3.5] md:scale-100 lg:scale-[1.5] xl:scale-100"
          />
        </div>
      </Container>
      {children}
    </div>
  );
}
