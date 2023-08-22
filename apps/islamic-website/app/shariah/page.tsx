import { ShariahPage } from '@haqq/islamic-website/shariah-page';
import { DEPLOY_URL, REVALIDATE_TIME } from '../../constants';
import { Metadata } from 'next';
import { getMembersContent } from '../../utils/get-members-data';

export const revalidate = REVALIDATE_TIME;

export const metadata: Metadata = {
  title: 'IslamicCoin | Shariah',
  description: '',
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
  const shariaMembers = (await getMembersContent()).shariahMembers;
  const advisoryMembers = (await getMembersContent()).advisoryMembers;
  const executiveMembers = (await getMembersContent()).executiveMembers;

  return (
    <ShariahPage
      shariahMembers={shariaMembers}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
    />
  );
}
