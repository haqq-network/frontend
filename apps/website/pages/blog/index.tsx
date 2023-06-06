import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';

export { BlogPage as default } from '@haqq/website/news-page';

interface StorybookPost {
  _uid: string;
  title: string;
  date: string;
  slug: string;
  description: string;
  image: any;
  featured: boolean;
  content: string;
  tags: string[];
}

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  image: { src: string; width: number; height: number };
  isFeatured: boolean;
  tags: string[];
}

function mapStorybookToPosts(data: { posts: StorybookPost[] }): Post[] {
  return data.posts
    .map((post) => {
      const image =
        post.image.filename && post.image.filename !== ''
          ? {
              src: post.image.filename,
              width: Number(post.image.filename.split('/')[5].split('x')[0]),
              height: Number(post.image.filename.split('/')[5].split('x')[1]),
            }
          : null;

      return {
        id: post._uid,
        title: post.title,
        slug: post.slug,
        date: post.date,
        description: post.description ?? '',
        image,
        isFeatured: post.featured,
        tags: post.tags,
      };
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function getStaticProps() {
  let posts;

  storyblokInit({
    accessToken: process.env['STORYBLOK_ACCESS_TOKEN'],
    use: [apiPlugin],
  });

  try {
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get('cdn/stories/blog', {
      version:
        process.env['VERCEL_ENV'] === 'production' ? 'published' : 'draft',
    });
    posts = mapStorybookToPosts(response.data.story.content);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      posts: posts ?? [],
    },
  };
}
