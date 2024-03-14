import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostPage } from '@haqq/islamic-website/blog-page';
import { DEPLOY_URL, REVALIDATE_TIME } from '../../../../constants';
import {
  getBlogPost,
  getHaqqBlogPostsFromFalconer,
} from '../../../../utils/get-blog-posts';

export const dynamicParams = true;

export const revalidate = REVALIDATE_TIME;

export async function generateStaticParams() {
  const { posts } = await getHaqqBlogPostsFromFalconer();

  return posts.map((post) => {
    return {
      slug: post.slug,
    };
  });
}

export async function generateMetadata(
  params: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {
    params: { slug },
  } = params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {};
  }

  const previousOgImages = (await parent).openGraph?.images || [];
  const previousTitleTemplate = (await parent).title?.template || '%s';
  const images = post.image
    ? [post.image?.src, ...previousOgImages]
    : previousOgImages;
  const title = previousTitleTemplate.replace('%s', `${post.title} | Blog`);
  const description = post.description;
  const url = new URL(`/blog/${slug}`, DEPLOY_URL).toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      url,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blogPost = await getBlogPost(slug);

  if (!blogPost) {
    notFound();
  }

  const { posts } = await getHaqqBlogPostsFromFalconer();
  const relatedTagPosts = posts
    .filter((post) => {
      return post.slug !== slug;
    })
    .filter((post) => {
      return post.tags.includes(blogPost.tags[0]);
    })
    .slice(0, 2);

  return <BlogPostPage post={blogPost} recentPosts={relatedTagPosts} />;
}
