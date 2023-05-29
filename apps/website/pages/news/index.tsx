export { NewsPage as default } from '@haqq/website/news-page';

export async function getServerSideProps() {
  const getPosts = await fetch(`https://jsonplaceholder.typicode.com/posts`);

  const posts = await getPosts.json();

  return {
    props: {
      posts,
    },
  };
}
