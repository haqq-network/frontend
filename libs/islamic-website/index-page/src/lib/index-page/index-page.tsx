import Image from 'next/image';
import { HeroBlock } from '../hero-block/hero-block';
import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { LearnAndGrowBlock } from '../learn-and-grow-block/learn-and-grow-block';
import { NewsBlock } from '../news-block/news-block';
import { PortfolioBlock } from '../portfolio-block/portfolio-block';
import { WhyBlock } from '../why-block/why-block';
import moonBgData from '../../assets/images/moon.png';
import clsx from 'clsx';
import styles from './index-page.module.css';
import { Fragment } from 'react';
import { Marquee } from '../marquee/marquee';

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
      <HeroBlock />
      <Marquee className="mt-[160px]">
        Our mission is to empower the world's Muslim community with a financial
        instrument for the Digital Age, that enables seamless transactions and
        interaction, while supporting innovation and philanthropy.
      </Marquee>
      <WhyBlock />
      <PortfolioBlock />
      <LearnAndGrowBlock />
      <NewsBlock news={mockNews} />
      <JoinCommunityBlock />
    </Fragment>
  );
}
