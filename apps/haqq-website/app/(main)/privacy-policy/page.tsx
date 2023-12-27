import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@haqq/haqq-website/privacy-policy-page';
import { DEPLOY_URL } from '../../../constants';
import { getPrivacyPolicyContentFromFalconer } from '../../../utils/get-privacy-policy';
import { haqqOpenGraphImages } from '../../shared-metadata';

const title = 'Privacy Policy';
const description =
  'Understand how HAQQ Network protects your privacy and manages data in compliance with ethical standards.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: new URL('/privacy-policy', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default async function Page() {
  const privacyPolicy = await getPrivacyPolicyContentFromFalconer();

  return <PrivacyPolicyPage privacyPolicy={privacyPolicy} />;
}
