import type { Metadata } from 'next';
import { getPartners } from '../../../utils/get-partners';
import { EcosystemPage } from '@haqq/haqq-website/ecosystem-page';
import { DEPLOY_URL } from '../../../constants';
import { haqqOpenGraphImages } from '../../shared-metadata';

const title = 'Ecosystem';
const description =
  'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: new URL('/ecosystem', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default async function Page() {
  const partners = await getPartners();

  return <EcosystemPage partners={partners} />;
}
