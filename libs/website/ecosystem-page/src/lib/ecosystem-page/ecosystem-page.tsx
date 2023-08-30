import { Fragment } from 'react';
import { TitleBlock } from '../title-block/title-block';
import { ApplyBlock } from '../apply-block/apply-block';
import { Partner, PartnersBlock } from '../partners-block/partners-block';
import { OGMetadataLink } from '@haqq/website-ui-kit';
import { DEPLOY_URL } from '@haqq/website/blog-page';

export function EcosystemPage({ partners }: { partners: Partner[] }) {
  return (
    <Fragment>
      <OGMetadataLink
        ogDescription=""
        hostname={String(new URL(DEPLOY_URL))}
        ogImage={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        ogTitle="HAQQ | Ecosystem"
      />
      <TitleBlock />
      <ApplyBlock />
      <PartnersBlock partners={partners} />
    </Fragment>
  );
}
