import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { DevelopersBlock } from '../developers-block/developers-block';
import { MissionBlock } from '../mission-block/mission-block';
import { Fragment } from 'react';
import Head from 'next/head';
import { VisionBlock } from '../vision-block/vision-block';
import { FeaturesBlock } from '../features-block/features-block';
import { EcosystemBlock } from '../ecosystem-block/ecosystem-block';

export function WebsiteIndexPage() {
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
        <FeaturesBlock />
        <MissionBlock />
        <VisionBlock />
        <DevelopersBlock />
        <EcosystemBlock />
        <ContactBlock />
      </section>
    </Fragment>
  );
}
