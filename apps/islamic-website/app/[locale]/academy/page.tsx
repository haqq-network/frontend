import type { Metadata } from 'next';
import { AcademyPreviewPage } from '@haqq/islamic-website/academy-page';
import { DEPLOY_URL, TURNSTILE_SITEKEY } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Academy';
const description =
  'Dive into a world of knowledge. Explore comprehensive guides on Shariah-compliant financial practices and blockchain integration.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/academy', DEPLOY_URL).toString(),
  },
};

export default async function Page() {
  return <AcademyPreviewPage turnstileSiteKey={TURNSTILE_SITEKEY} />;
}
