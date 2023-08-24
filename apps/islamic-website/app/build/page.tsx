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
  },
};

export { BuildPage as default } from '@haqq/islamic-website/build-page';
