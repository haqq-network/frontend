import type { Metadata } from 'next';
import { MarketsPage } from '@haqq/islamic-website-markets-page/server';
import { DEPLOY_URL } from '../../../constants';
import { getPriceFromFalconer } from '../../../utils/get-price';
import { createCurrencyFormatter } from '../../../utils/locale-utils';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Markets';
const description = '';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/markets', DEPLOY_URL).toString(),
  },
};

export default async function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const price = await getPriceFromFalconer();
  const formatter = createCurrencyFormatter(locale);

  return <MarketsPage price={formatter.format(price)} />;
}
