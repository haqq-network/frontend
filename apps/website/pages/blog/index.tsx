import { Post } from '@haqq/website/news-page';
import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';

export { BlogPage as default } from '@haqq/website/news-page';

interface StorybookPost {
  _uid: string;
  title: string;
  date: string;
  slug: string;
  description: string;
  image: {
    filename: null | string;
  };
  featured: boolean;
  content: string;
  tags: string[];
}

function mapStorybookToPosts(data: { posts: StorybookPost[] }): Post[] {
  return data.posts
    .map((post) => {
      if (!post.isPublished) {
        return null;
      }

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
        content: post.content ?? '',
        image,
        isFeatured: post.featured,
        tags: post.tags,
      };
    })
    .filter(Boolean)
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
    revalidate: 1800, // revalidate every half hour
  };
}
