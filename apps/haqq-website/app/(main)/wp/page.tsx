import type { Metadata } from 'next';
import { getWhitepaper } from '../../../utils/get-whitepaper';
import { WhitepaperPage } from '@haqq/haqq-website/whitepaper-page';
import { DEPLOY_URL } from '../../../constants';
import { haqqOpenGraphImages } from '../../shared-metadata';

const title = 'Whitepaper';
const description =
  'The blueprint for a harmonious meld of Islamic finance and blockchain. Delve deep into the vision and strategies steering HAQQ and Islamic Coin.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/wp', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

interface PageProps {
  params: { locale: string };
}

export default async function Page(props: PageProps) {
  const {
    params: { locale },
  } = props;
  const whitepaper = await getWhitepaper(locale);

  return <WhitepaperPage whitepaper={whitepaper} />;
}
