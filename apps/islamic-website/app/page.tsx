import { IndexPage } from '@haqq/islamic-website/index-page';
import { mapStorybookToNews } from './news/page';
import { storyblokInit, apiPlugin } from '@storyblok/js';

const STORYBLOK_ACCESS_TOKEN =
  process.env['STORYBLOK_ISLAMIC_WEBSITE_ACCESS_TOKEN'];
const VERCEL_ENV = process.env['VERCEL_ENV'];

async function getNewsPageContent() {
  const { storyblokApi } = storyblokInit({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  });

  if (!storyblokApi) {
    throw new Error('Failed to init storyblok');
  }

  const response = await storyblokApi.get('cdn/stories/media', {
    version: VERCEL_ENV === 'production' ? 'published' : 'draft',
  });

  const posts = mapStorybookToNews(response.data.story.content.body[0].columns);

  const mainPagePosts = posts.slice(0, 3);

  return mainPagePosts;
}

export default async function Page() {
  const news = await getNewsPageContent();
  return <IndexPage news={news} />;
}
