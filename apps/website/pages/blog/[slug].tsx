import { Post } from '@haqq/website/news-page';
import { getStoryblokApi, storyblokInit, apiPlugin } from '@storyblok/react';
import type { GetStaticProps, GetStaticPaths } from 'next';

export { PostPage as default } from '@haqq/website/news-page';

export const getStaticPaths: GetStaticPaths = async () => {
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

    const paths = response.data.story.content.posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    });

    return {
      paths: paths,
      fallback: false,
    };
  } catch (error) {
    console.error(error);
  }

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{
  post: Post;
  recentPosts: Post[];
}> = async (ctx) => {
  storyblokInit({
    accessToken: process.env['STORYBLOK_ACCESS_TOKEN'],
    use: [apiPlugin],
  });

  try {
    const slug = ctx.params.slug;
    const storyblokApi = getStoryblokApi();
    const response = await storyblokApi.get('cdn/stories/blog', {
      version:
        process.env['VERCEL_ENV'] === 'production' ? 'published' : 'draft',
    });
    const post = response.data.story.content.posts.find((post) => {
      return post.slug === slug;
    });

    if (!post || !post.published) {
      return {
        props: { post: null, recentPosts: [] },
        notFound: true,
      };
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
      props: {
        post: {
          id: post._uid,
          title: post.title,
          slug: post.slug,
          date: post.date,
          content: post.content,
          image,
          tags: post.tags,
        },
        recentPosts: [],
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    return {
      props: { post: null, recentPosts: [] },
      notFound: true,
    };
  }
};
