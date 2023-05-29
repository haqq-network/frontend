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
}> = async (ctx) => {
  const id = ctx.params.post;

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  const post: Post = await res.json();

  return { props: { post } };
};
