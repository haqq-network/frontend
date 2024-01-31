import type { Metadata } from 'next';
import { AcademyModulesPage } from '@haqq/islamic-website/academy-page';
import { DEPLOY_URL } from '../../../../../../constants';
import { islamicOpenGraphImages } from '../../../../../shared-metadata';

const title = 'Academy';
const description =
  'Dive into a world of knowledge. Explore comprehensive guides on Shariah-compliant financial practices and blockchain integration.';

export async function generateMetadata(params: {
  params: { moduleIndex: string; lessonIndex: string };
}): Promise<Metadata> {
  const {
    params: { moduleIndex, lessonIndex },
  } = params;
  const images = islamicOpenGraphImages;
  const url = new URL(
    `/academy/lessons/${moduleIndex}/${lessonIndex}`,
    DEPLOY_URL,
  ).toString();

  return {
    title,
    description,
    openGraph: {
      title: `${title} | IslamicCoin`,
      description,
      images,
      url,
    },
  };
}

export default async function Page({
  params,
}: {
  params: { moduleIndex: string; lessonIndex: string };
}) {
  return (
    <AcademyModulesPage
      lessonIndex={Number(params.lessonIndex)}
      moduleIndex={Number(params.moduleIndex)}
    />
  );
}
