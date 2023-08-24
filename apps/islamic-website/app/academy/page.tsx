import type { Metadata } from 'next';

const title = 'IslamicCoin | Academy';
const description =
  'Dive into a world of knowledge. Explore comprehensive guides on Shariah-compliant financial practices and blockchain integration.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: '/opengraph-image.png' }],
  },
};

// export { AcademyPage as default } from '@haqq/islamic-website/academy-page';
export { AvailableSoonPage as default } from '@haqq/islamic-website/academy-page';
