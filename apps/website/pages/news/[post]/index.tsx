export { PostPage as default } from '@haqq/website/news-page';

export async function getServerSideProps(ctx) {
  const id = ctx.query.post;
  const getPost = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );

  const post = await getPost.json();

  return {
    props: {
      post: post,
    },
  };
}
