import { Fragment } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import {
  Container,
  Member,
  MoonAnimatedBg,
  NewsPost,
} from '@haqq/islamic-website-ui-kit';
import { BoardMembersBlock } from '../board-members-block/board-members-block';
import { FinanceBlock } from '../finance-block/finance-block';
import { FundsBlock } from '../funds-block/funds-block';
import { HeroBlock } from '../hero-block/hero-block';
import { JoinCommunityBlock } from '../join-community-block/join-community-block';
import { LearnAndGrowBlock } from '../learn-and-grow-block/learn-and-grow-block';
import { Marquee } from '../marquee/marquee';
import { NewsBlock } from '../news-block/news-block';
import { PortfolioBlock } from '../portfolio-block/portfolio-block';
import { ChainStats, WhyBlock } from '../why-block/why-block';

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
      <MoonAnimatedBg
        className={clsx(
          'translate-x-[37%] translate-y-[-21.3%]',
          'md:translate-x-1/2 md:translate-y-[-16.1%]',
          'lg:translate-y-[-23.45%]',
          'xl:translate-y-[-24.9%]',
          'min-[1440px]:translate-y-[-23.8%]',
        )}
      />
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
