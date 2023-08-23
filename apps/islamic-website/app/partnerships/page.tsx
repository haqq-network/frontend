import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';

export { PartnershipPage as default } from '@haqq/islamic-website/partnership-page';

export const metadata: Metadata = {
  title: 'IslamicCoin | Partnership',
  description:
    "Collaborate with a pioneer in Shariah-compliant blockchain solutions. Let's redefine ethical finance together.",
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};
