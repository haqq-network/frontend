import type { Metadata } from 'next';
import { RoadmapPage } from '@haqq/islamic-website/roadmap-page';
import { getRoadmapContentFromFalconer } from '../../../utils/get-roadmap';
import { DEPLOY_URL, TURNSTILE_SITEKEY } from '../../../constants';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Roadmap';
const description =
  'Chart the evolution of Islamic Coin as we pioneer the melding of Islamic traditions with blockchain technology.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/roadmap', DEPLOY_URL).toString(),
  },
};
interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  const roadmap = await getRoadmapContentFromFalconer(locale);

  return <RoadmapPage roadmap={roadmap} turnstileSiteKey={TURNSTILE_SITEKEY} />;
}
