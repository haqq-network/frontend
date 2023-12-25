import type { Metadata } from 'next';
import { getHAQQPartnersFromFalconer } from '../../../utils/get-partners';
import { EcosystemPage } from '@haqq/haqq-website/ecosystem-page';
import { DEPLOY_URL } from '../../../constants';
import { haqqOpenGraphImages } from '../../shared-metadata';

const title = 'Ecosystem';
const description =
  'Explore the HAQQ Network ecosystem comprising Bridge, Wallet, Infrastructure, DeFi, Payments, Services, and Institutional, designed to foster community-driven decentralized technologies worldwide.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/ecosystem', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default async function Page() {
  const partners = await getHAQQPartnersFromFalconer();

  return <EcosystemPage partners={partners} />;
}
