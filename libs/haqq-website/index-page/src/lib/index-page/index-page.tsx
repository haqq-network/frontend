import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { DevelopersBlock } from '../developers-block/developers-block';
import { MissionBlock } from '../mission-block/mission-block';
import { VisionBlock } from '../vision-block/vision-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';
import { DEPLOY_URL } from '@haqq/haqq-website/blog-page';
import Head from 'next/head';

export function WebsiteIndexPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Home of ethical web3</title>

        <meta
          name="description"
          content="Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance"
        />
        <meta property="og:locale" content="en-US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HAQQ | Home of ethical web3" />
        <meta
          property="og:description"
          content="Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance"
        />
        <meta
          property="og:url"
          content={`${new URL('/', DEPLOY_URL).toString()}`}
        />
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:title" content="HAQQ | Home of ethical web3" />
        <meta
          name="twitter:description"
          content="Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance"
        />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <section>
        <HeroBlock />
        <AboutBlock />
        <StatisticsBlock />
        <MissionBlock />
        <VisionBlock />
        <DevelopersBlock />
        <ContactBlock />
      </section>
    </Fragment>
  );
}
