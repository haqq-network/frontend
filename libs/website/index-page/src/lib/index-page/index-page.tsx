import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { DevelopersBlock } from '../developers-block/developers-block';
import { MissionBlock } from '../mission-block/mission-block';
import Head from 'next/head';
import { VisionBlock } from '../vision-block/vision-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';
import Script from 'next/script';

export function WebsiteIndexPage() {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | Home of ethical web3</title>
        <meta
          name="description"
          content="Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance"
        />
        {process.env['GOOGLE_TAG_ID'] &&
          process.env['GOOGLE_TAG_ID'] !== '' && (
            <Fragment>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env['GOOGLE_TAG_ID']}`}
              />
              <Script id="google-analytics">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${process.env['GOOGLE_TAG_ID']}');
          `}
              </Script>
            </Fragment>
          )}
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
