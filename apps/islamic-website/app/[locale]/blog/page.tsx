import type { Metadata } from 'next';
import { BlogPage } from '@haqq/islamic-website/blog-page';
import { DEPLOY_URL, TURNSTILE_SITEKEY } from '../../../constants';
import { getIslamicBlogPostsFromFalconer } from '../../../utils/get-blog-posts';
import { islamicOpenGraphImages } from '../../shared-metadata';

const title = 'Blog';
const description =
  'Stay updated with the latest news, insights, and trends in the world of ethical and Islamic Finance technology with Islamic Coin blog.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} | IslamicCoin`,
    description,
    images: islamicOpenGraphImages,
    url: new URL('/blog', DEPLOY_URL).toString(),
  },
};

export default async function Page() {
  const { posts, tags } = await getIslamicBlogPostsFromFalconer();

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
    <BlogPage
      featuredPost={featuredPost}
      posts={postsToRender}
      turnstileSiteKey={TURNSTILE_SITEKEY}
      tags={tags}
    />
  );
}
