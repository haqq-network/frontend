import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@haqq/islamic-website/privacy-policy-page';
import { DEPLOY_URL } from '../../../constants';
import { getPrivacyPolicyContentFromFalconer } from '../../../utils/get-privacy-policy';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Privacy Policy';

export const metadata: Metadata = {
  title,
  openGraph: {
    title: `${title} | IslamicCoin`,
    images: islamicOpenGraphImages,
    url: new URL('/privacy-policy', DEPLOY_URL).toString(),
  },
};

export default async function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const privacyPolicy = await getPrivacyPolicyContentFromFalconer(locale);

  return <PrivacyPolicyPage privacyPolicy={privacyPolicy} />;
}
