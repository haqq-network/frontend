import { Fragment, useCallback, useEffect, useState } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { DevelopersBlock } from '../developers-block/developers-block';
import { MissionBlock } from '../mission-block/mission-block';
import Head from 'next/head';
import { VisionBlock } from '../vision-block/vision-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';

interface WebsiteIndexPageProps {
  stats: {
    mainnetAccountsCreated: number;
    transactionsInLast24Hours: number;
    secondsToConsensusFinality: number;
    averageCostPerTransaction: number;
    era: number;
    emissionRate: number;
    emittedAlready: number;
    willBeEmitted: number;
  };
}

export function WebsiteIndexPage({ stats }: WebsiteIndexPageProps) {
  const [startAnimation, setStartAnimation] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 1000) {
      setStartAnimation(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
        <StatisticsBlock stats={stats} startAnimation={startAnimation} />
        <MissionBlock />
        <VisionBlock />
        <DevelopersBlock />
        <ContactBlock />
      </section>
    </Fragment>
  );
}
