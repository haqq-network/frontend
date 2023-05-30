export { PostPage as default } from '@haqq/website/news-page';

import type { GetStaticProps, GetStaticPaths } from 'next';

type Post = {
  id: number;
  title: string;
  body: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts: Post[] = await res.json();

  const paths = posts.map((post) => ({
    params: { post: String(post.id) },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<{
  post: Post;
  recentPosts: Post[];
}> = async (ctx) => {
  try {
    const id = ctx.params.post;

    const [postsResponse, postResponse] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts'),
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
    ]);

    if (!postsResponse.ok || !postResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const allPosts: Post[] = await postsResponse.json();

    const recentPosts: Post[] = allPosts.slice(-2);

    const post: Post = await postResponse.json();

    return { props: { post, recentPosts } };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    return { props: { post: null, recentPosts: [] }, notFound: true };
  }
};
