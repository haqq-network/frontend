import { Fragment } from 'react';
import {
  HaqqAssetsBlock,
  IslamicAssetsBlock,
} from '../assets-block/assets-block';
import { TitleBlock } from '../title-block/title-block';
import { DEPLOY_URL } from '@haqq/website/blog-page';
import { OGMetadataLink } from '@haqq/website-ui-kit';

export function BrandAssetsPage() {
  return (
    <Fragment>
      <OGMetadataLink
        ogDescription=""
        hostname={String(new URL(DEPLOY_URL))}
        ogImage={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        ogTitle="HAQQ | Brand assets"
      />
      <TitleBlock />
      <HaqqAssetsBlock />
      <IslamicAssetsBlock />
    </Fragment>
  );
}
