import type { Metadata } from 'next';
import { ShariahPage } from '@haqq/islamic-website/shariah-page';
import { getMembersContent } from '../../../utils/get-members-data';
import { getFatwaContent } from '../../../utils/get-fatwa-content';
import { DEPLOY_URL } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Shariah';
const description =
  'Our steadfast commitment to Shariah principles provides an ethical foundation for modern digital finance. Dive into our adherence to Islamic traditions.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/shariah', DEPLOY_URL).toString(),
  },
};

interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  const fatwa = await getFatwaContent({ locale });
  const { shariahMembers, advisoryMembers, executiveMembers } =
    await getMembersContent(locale);

  return (
    <ShariahPage
      fatwa={fatwa}
      locale={locale}
      shariahMembers={shariahMembers}
      advisoryMembers={advisoryMembers}
      executiveMembers={executiveMembers}
    />
  );
}
