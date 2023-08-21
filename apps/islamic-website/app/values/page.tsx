export { ValuesPage as default } from '@haqq/islamic-website/values-page';

const DEPLOY_URL = `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`;

export const metadata = {
  title: 'IslamicCoin | Our Values',
  description:
    'Our values are the foundation of our company and our products. They guide our decisions, actions and the way we work with each other and our clients.',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};
