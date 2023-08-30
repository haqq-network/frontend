import { Fragment } from 'react';
import { ApplyBlock } from '../apply-block/apply-block';
import { TextBlock } from '../text-block.tsx/text-block';
import { TitleBlock } from '../title-block/title-block';
import { DEPLOY_URL } from '@haqq/website/blog-page';
import { OGMetadataLink } from '@haqq/website-ui-kit';

export function EcosystemFundPage() {
  return (
    <Fragment>
      <OGMetadataLink
        ogDescription=""
        hostname={String(new URL(DEPLOY_URL))}
        ogImage={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        ogTitle="HAQQ | Ecosystem fund"
      />
      <TitleBlock />
      <TextBlock />
      <ApplyBlock />
    </Fragment>
  );
}
