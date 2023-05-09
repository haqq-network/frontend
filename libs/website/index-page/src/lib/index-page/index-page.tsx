import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { DevelopersBlock } from '../developers-block/developers-block';
import { MissionBlock } from '../mission-block/mission-block';
import Head from 'next/head';
import { VisionBlock } from '../vision-block/vision-block';
import {
  ChainStats,
  StatisticsBlock,
} from '../statistics-block/statistics-block';

export interface WebsiteIndexPageProps {
  stats: ChainStats;
}

export function WebsiteIndexPage({ stats }: WebsiteIndexPageProps) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Home of ethical web3</title>
        <meta
          name="description"
          content="Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance"
        />
      </Head>
      <section>
        <HeroBlock />
        <AboutBlock />
        <StatisticsBlock stats={stats} />
        <MissionBlock />
        <VisionBlock />
        <DevelopersBlock />
        <ContactBlock />
      </section>
    </Fragment>
  );
}
