import Image from 'next/image';
import { HeroBlock } from '../hero-block/hero-block';
import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { LearnAndGrowBlock } from '../learn-and-grow-block/learn-and-grow-block';
import { NewsBlock } from '../news-block/news-block';
import { PortfolioBlock } from '../portfolio-block/portfolio-block';
import { WhyBlock } from '../why-block/why-block';
import { Fragment } from 'react';
import { Marquee } from '../marquee/marquee';
import { Container, Member, NewsPost } from '@haqq/islamic-ui-kit';
import moonBgImageData from '../../assets/images/moon-2x.webp';
import { FinanceBlock } from '../finance-block/finance-block';
import { AdvisoryBoardBlock } from '../advisory-block/advisory-block';
import clsx from 'clsx';

const RUNNING_TEXT =
  "Our mission is to empower the world's Muslim community with a financial instrument for the Digital Age, that enables seamless transactions and interaction, while supporting innovation and philanthropy.";

export function IndexPage({
  news,
  advisoryMembers,
}: {
  news: NewsPost[];
  advisoryMembers: Member[];
}) {
  return (
    <Fragment>
      <Hero />
      <FinanceBlock />
      <AdvisoryBoardBlock members={advisoryMembers} />
      <PortfolioBlock />
      <LearnAndGrowBlock />
      <NewsBlock news={news} />
      <JoinCommunityBlock />
    </Fragment>
  );
}

function Hero() {
  return (
    <div className="overflow-x-clip">
      <Container className="relative">
        <HeroBlock />

        <Marquee className="my-[20px] mb-[80px] mt-[60px] md:mt-[120px] lg:my-[100px] lg:mt-[150px]">
          {RUNNING_TEXT.toLocaleUpperCase()}
        </Marquee>

        <WhyBlock />

        <div
          className={clsx(
            'absolute z-[-1] select-none',
            'h-[1011px] w-[1038px] md:h-[877px] md:w-[901px] lg:h-[1400px] lg:w-[1440px]',
            '-top-1/2 right-1/2 translate-x-[37%] translate-y-[30%]',
            'md:translate-x-1/2 md:translate-y-[44%]',
            'lg:translate-y-[18%]',
            'xl:translate-y-[15%]',
          )}
        >
          <div className="z-1 pointer-events-none absolute inset-0 scale-[3.5] bg-gradient-to-r from-[#010304] from-10% to-transparent md:scale-100 lg:scale-[1.5] xl:scale-100" />
          <Image
            src={moonBgImageData}
            alt=""
            fill
            className="pointer-events-none z-[-2]"
          />
        </div>
      </Container>
    </div>
  );
}
