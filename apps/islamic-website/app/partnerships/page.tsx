import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Partnership';
const description =
  "Collaborate with a pioneer in Shariah-compliant blockchain solutions. Let's redefine ethical finance together.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
    locale: 'en-US',
    url: `${new URL(DEPLOY_URL)}build`,
    type: 'website',
  },
};

export { PartnershipPage as default } from '@haqq/islamic-website/partnership-page';
