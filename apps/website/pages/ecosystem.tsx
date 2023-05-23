import { getStoryblokApi } from '@storyblok/react';

export { EcosystemPage as default } from '@haqq/website/ecosystem-page';

export async function getStaticProps() {
  let data;
  const slug = 'partners';

  try {
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft',
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
    revalidate: 1,
  };
}
