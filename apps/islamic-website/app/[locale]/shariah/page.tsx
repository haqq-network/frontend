import type { Metadata } from 'next';
import { ShariahPage } from '@haqq/islamic-website/shariah-page';
import { DEPLOY_URL } from '../../../constants';
import { getFatwaContentFromFalconer } from '../../../utils/get-fatwa';
import { getMembersContentFromFalconer } from '../../../utils/get-members';
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
  const fatwa = await getFatwaContentFromFalconer(locale);
  const members = await getMembersContentFromFalconer(locale);

  return (
    <ShariahPage
      fatwa={fatwa}
      locale={locale}
      shariahMembers={members?.shariahMembers ?? []}
      advisoryMembers={members?.advisoryMembers ?? []}
      executiveMembers={members?.executiveMembers ?? []}
    />
  );
}
