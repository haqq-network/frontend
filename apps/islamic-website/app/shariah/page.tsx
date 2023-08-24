import { ShariahPage } from '@haqq/islamic-website/shariah-page';
import { DEPLOY_URL } from '../../constants';
import { Metadata } from 'next';
import { getMembersContent } from '../../utils/get-members-data';

export const metadata: Metadata = {
  title: 'IslamicCoin | Shariah',
  description:
    'Our steadfast commitment to Shariah principles provides an ethical foundation for modern digital finance. Dive into our adherence to Islamic traditions.',
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image.png' }],
  },
  metadataBase: new URL(DEPLOY_URL),
};

export default async function Page() {
  const { shariahMembers, advisoryMembers, executiveMembers } =
    await getMembersContent();

  return (
    <ShariahPage
      shariahMembers={shariahMembers}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
    />
  );
}
