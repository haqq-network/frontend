import { Fragment } from 'react';
import { HeroBlock } from '../hero-block/hero-block';
import { AboutBlock } from '../about-block/about-block';
import { ContactBlock } from '../contact-block/contact-block';
import { DevelopersBlock } from '../developers-block/developers-block';
import { MissionBlock } from '../mission-block/mission-block';
import { VisionBlock } from '../vision-block/vision-block';
import { StatisticsBlock } from '../statistics-block/statistics-block';
import { OGMetadataLink } from '@haqq/website-ui-kit';
import { DEPLOY_URL } from '@haqq/website/blog-page';

export function WebsiteIndexPage() {
  return (
    <Fragment>
      <OGMetadataLink
        ogDescription="Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance"
        hostname={String(new URL(DEPLOY_URL))}
        ogImage={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        ogTitle="HAQQ | Home of ethical web3"
      />
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
