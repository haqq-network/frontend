import type { Metadata } from 'next';
import { getPartners } from '../../../utils/get-partners';
import { EcosystemPage } from '@haqq/haqq-website/ecosystem-page';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description:
    'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance',
};

export default async function Page() {
  const partners = await getPartners();

  return <EcosystemPage partners={partners} />;
}
