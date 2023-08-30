import type { Metadata } from 'next';
import { ShariahPage } from '@haqq/islamic-website/shariah-page';
import { getMembersContent } from '../../utils/get-members-data';
import { DEPLOY_URL } from '../../constants';

const title = 'IslamicCoin | Shariah';
const description =
  'Our steadfast commitment to Shariah principles provides an ethical foundation for modern digital finance. Dive into our adherence to Islamic traditions.';

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
