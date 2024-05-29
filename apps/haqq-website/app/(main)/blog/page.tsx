import type { Metadata } from 'next';
import { BlogPage } from '@haqq/haqq-website/blog';
import { DEPLOY_URL, REVALIDATE_TIME } from '../../../constants';
import { getHaqqBlogPostsFromFalconer } from '../../../utils/get-blog-posts';
import { haqqOpenGraphImages } from '../../shared-metadata';

export const dynamicParams = true;
export const revalidate = REVALIDATE_TIME;

const title = 'Blog';
const description =
  "Stay updated with the latest news, insights, and trends in the world of ethical and Islamic Finance technology with HAQQ's blog.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | HAQQ`,
    description,
    url: new URL('/blog', DEPLOY_URL).toString(),
    images: haqqOpenGraphImages,
  },
};

export default async function Page() {
  const { posts, tags } = await getHaqqBlogPostsFromFalconer();

  let featuredPost;
  const postsToRender = [];

  for (const post of posts) {
    if (!featuredPost && post.isFeatured) {
      featuredPost = post;
    } else {
      postsToRender.push(post);
    }
  }

  return (
    <BlogPage featuredPost={featuredPost} posts={postsToRender} tags={tags} />
  );
}
