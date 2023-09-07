import type { Metadata } from 'next';
import { getBlogPosts } from '../../../utils/get-blog-posts';
import { BlogPage } from '@haqq/haqq-website/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Ethics-first network that welcomes sustainability-centered developers, validators and open source contributors as well as Muslim innovators in sustainable Finance',
};

export default async function Page() {
  const { posts, tags } = await getBlogPosts();

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
