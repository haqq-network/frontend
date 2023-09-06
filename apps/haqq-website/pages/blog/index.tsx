import { Post } from '@haqq/haqq-website/blog-page';
import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';
import { GetStaticProps } from 'next';

export { BlogPage as default } from '@haqq/haqq-website/blog-page';

storyblokInit({
  accessToken: process.env['STORYBLOK_ACCESS_TOKEN'],
  use: [apiPlugin],
});

export interface StoryblokPost {
  _uid: string;
  title: string;
  date: string;
  slug: string;
  description: string;
  image: {
    filename: null | string;
  };
  featured: boolean;
  published: boolean;
  content: string;
  tags: string[];
}

function mapStorybookToPosts(data: { posts: StoryblokPost[] }): Post[] {
  return data.posts
  .filter((post) => {
    return post.published
  })
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

export const getStaticProps: GetStaticProps = async () => {
  let posts;

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
};
