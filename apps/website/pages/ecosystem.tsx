import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';

storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
});

export { EcosystemPage as default } from '@haqq/website/ecosystem-page';

export async function getStaticProps() {
  let data;
  const slug = 'partners';

  try {
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: process.env.VERCEL_ENV === 'production' ? 'published' : 'draft',
    });
    data = response?.data;
  } catch (error) {
    console.error(error);
  }

  const mapStoryblockDataToPartners = async (data) => {
    return data.story.content.body[0].columns.map((el) => {
      return {
        _uid: el._uid,
        name: el.name,
        logoUrl: el.logo.filename,
        link: el.link,
        description: el.description,
        type: el.type,
        status: el.status,
      };
    });
  };

  const partners = await mapStoryblockDataToPartners(data);

  return {
    props: {
      partners: partners ?? false,
      key: data?.story?.id ?? false,
    },
    revalidate: 1800,
  };
}
