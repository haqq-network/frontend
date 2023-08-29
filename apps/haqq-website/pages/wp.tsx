import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';

export { WhitepaperPage as default } from '@haqq/haqq-website/whitepaper-page';

storyblokInit({
  accessToken: process.env['STORYBLOK_ACCESS_TOKEN'],
  use: [apiPlugin],
});

export async function getStaticProps() {
  let whitepaper;

  try {
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get('cdn/stories/whitepaper', {
      version:
        process.env['VERCEL_ENV'] === 'production' ? 'published' : 'draft',
    });

    whitepaper = response.data.story.content.body;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      whitepaper: whitepaper ?? '',
    },
    revalidate: 1800, // revalidate every half hour
  };
}
