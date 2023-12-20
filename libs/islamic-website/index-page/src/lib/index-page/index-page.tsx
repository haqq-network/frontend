'use client';

import Image from 'next/image';
import { HeroBlock } from '../hero-block/hero-block';
import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { LearnAndGrowBlock } from '../learn-and-grow-block/learn-and-grow-block';
import { NewsBlock } from '../news-block/news-block';
import { PortfolioBlock } from '../portfolio-block/portfolio-block';
import { ChainStats, WhyBlock } from '../why-block/why-block';
import { Fragment, useEffect, useState } from 'react';
import { Marquee } from '../marquee/marquee';
import { Container, Member, NewsPost } from '@haqq/islamic-website-ui-kit';
import { FinanceBlock } from '../finance-block/finance-block';
import { BoardMembersBlock } from '../board-members-block/board-members-block';
import clsx from 'clsx';
import { FundsBlock } from '../funds-block/funds-block';
import { useTranslations } from 'next-intl';

export function IndexPage({
  news,
  advisoryMembers,
  shariahMembers,
  executiveMembers,
  stats,
}: {
  news?: NewsPost[];
  advisoryMembers: Member[];
  shariahMembers: Member[];
  executiveMembers: Member[];
  stats: ChainStats;
}) {
  return (
    <Fragment>
      <Hero stats={stats} />
      <FundsBlock />
      <FinanceBlock />
      <NewsBlock news={news} />
      <BoardMembersBlock
        executiveMembers={executiveMembers}
        shariahMembers={shariahMembers}
        advisoryMembers={advisoryMembers}
      />
      <PortfolioBlock />
      <LearnAndGrowBlock />
      <JoinCommunityBlock />
    </Fragment>
  );
}

function Hero({ stats }: { stats: ChainStats }) {
  const t = useTranslations('index-page.hero-block');

  return (
    <div className="overflow-x-clip">
      <HeroBg />
      <Container>
        <HeroBlock />

        <Marquee className="my-[80px] md:my-[100px] xl:mt-[140px]">
          {t('running-text').toLocaleUpperCase()}
        </Marquee>

        <WhyBlock stats={stats} />
      </Container>
    </div>
  );
}

function HeroBg() {
  const [animationStep, setAnimationStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setAnimationStep(2);
    }, 3000);

    const timeout2 = setTimeout(() => {
      setAnimationStep(3);
    }, 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <Container className="relative">
      <div
        className={clsx(
          'absolute z-[-1] select-none',
          'h-[1011px] w-[1038px] md:h-[877px] md:w-[901px] lg:h-[1401px] lg:w-[1439px]',
          '-top-1/2 right-1/2 translate-x-[37%] translate-y-[-21.3%]',
          'md:translate-x-1/2 md:translate-y-[-16.1%]',
          'lg:translate-y-[-23.45%]',
          'xl:translate-y-[-24.9%]',
          'min-[1440px]:translate-y-[-23.8%]',
          'duration-[3000ms] ease-out',
          animationStep === 1 && 'scale-[.9] opacity-0',
          animationStep === 2 && 'scale-[.95] opacity-90',
          animationStep === 3 && 'scale-[1] opacity-100',
        )}
      >
        <div className="z-1 pointer-events-none absolute inset-0 scale-[3.5] bg-gradient-to-r from-[#010304] from-10% to-transparent md:scale-100 lg:scale-[1.5] xl:scale-100" />
        <Image
          src="/assets/images/moon.webp"
          alt=""
          fill
          className="pointer-events-none z-[-2]"
          priority
          onLoad={() => {
            setAnimationStep(1);
          }}
        />
      </div>
    </Container>
  );
}
