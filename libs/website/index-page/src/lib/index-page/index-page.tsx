import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { PartnershipBlock } from '../partnership-block/partnership-block';
import { MissionBlock } from '../mission-block/mission-block';
import { Fragment } from 'react';
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
      </Head>
      <section>
        <HeroBlock />
        <AboutBlock />
        <MissionBlock />
        <PartnershipBlock />
        <ContactBlock />
      </section>
    </Fragment>
  );
}
