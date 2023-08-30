import { DEPLOY_URL } from '../../constants';
import type { Metadata } from 'next';

const title = 'IslamicCoin | Build';
const description =
  'Content: Develop and innovate on a platform that brings Islamic financial traditions to the blockchain forefront.';

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

export { BuildPage as default } from '@haqq/islamic-website/build-page';
