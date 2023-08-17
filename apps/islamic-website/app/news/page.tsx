import { NewsPage } from '@haqq/islamic-website/news-page';
import { NewsPost } from '@haqq/islamic-ui-kit';
import { storyblokInit, apiPlugin } from '@storyblok/js';

const STORYBLOK_ACCESS_TOKEN =
  process.env['STORYBLOK_ISLAMIC_WEBSITE_ACCESS_TOKEN'];
const VERCEL_ENV = process.env['VERCEL_ENV'];

interface StoryblokNewsPost {
  _uid: string;
  date: string;
  text: string;
  image: {
    filename: null | string;
  };
  title: string;
  main_url: string;
  content_type: 'PRESS' | 'VIDEO';
  main_url_text: string;
}

function mapStorybookToNews(data: StoryblokNewsPost[]): NewsPost[] {
  return data.map((post) => {
    const image =
      post.image.filename && post.image.filename !== ''
        ? {
            src: post.image.filename,
            width: Number(post.image.filename.split('/')[5].split('x')[0]),
            height: Number(post.image.filename.split('/')[5].split('x')[1]),
          }
        : null;

    return {
      image,
      title: post.title,
      description: post.text,
      date: new Date(post.date),
      source: post.main_url_text,
      type: post.content_type === 'PRESS' ? 'press' : 'events',
      url: post.main_url,
    };
  });
}

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

  console.log(response.data.story.content.body[0].columns);
  const posts = mapStorybookToNews(response.data.story.content.body[0].columns);

  return posts;
}

export const metadata = {
  title: 'IslamicCoin | News',
};

export default async function Page() {
  const news = await getNewsPageContent();
  return <NewsPage news={news} />;
}
