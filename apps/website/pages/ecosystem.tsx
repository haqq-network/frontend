import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';

interface PartnerData {
  _uid: string;
  name: string;
  logo: {
    filename: string;
  };
  link: string;
  description: string;
  type: string;
  status: string;
}

interface StoryblokData {
  story: {
    content: {
      body: {
        columns: PartnerData;
      };
    };
  };
}

function mapStoryblockDataToPartners(data: StoryblokData) {
  return data.story.content.body[0].columns.map((el: PartnerData) => {
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
}

export { EcosystemPage as default } from '@haqq/website/ecosystem-page';

export async function getStaticProps() {
  let data;

  storyblokInit({
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  try {
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get('cdn/stories/partners', {
      version: process.env.VERCEL_ENV === 'production' ? 'published' : 'draft',
    });
    data = response?.data;
  } catch (error) {
    console.error(error);
  }

  const partners = mapStoryblockDataToPartners(data);

  return {
    props: {
      partners: partners ?? [],
      key: data?.story?.id ?? false,
    },
    revalidate: 1800,
  };
}
