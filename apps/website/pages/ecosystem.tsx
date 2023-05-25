import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';

export { EcosystemPage as default } from '@haqq/website/ecosystem-page';

export async function getStaticProps() {
  let data;
  const slug = 'partners';

  storyblokInit({
    accessToken: process.env['STORYBLOK_ACCESS_TOKEN'],
    use: [apiPlugin],
  });

  try {
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: process.env.VERCEL_ENV === 'production' ? 'published' : 'draft',
    });
    data = response?.data;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      story: data?.story ?? false,
      key: data?.story?.id ?? false,
    },
    revalidate: 60,
  };
}
