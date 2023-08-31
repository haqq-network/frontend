import { TitleBlock } from '../title-block/title-block';
import { Fragment, useMemo } from 'react';
import { PostsBlock } from '../posts-block/posts-block';
import { FeaturedPostBlock } from '../featured-post-block/featured-post-block';
import Head from 'next/head';

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  content?: string;
  description?: string;
  image: { src: string; width: number; height: number } | null;
  isFeatured?: boolean;
  tags: string[];
}

export const DEPLOY_URL = `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`;

export function BlogPage({ posts }: { posts: Post[] }) {
  const { featuredPost, postsToRender, tags } = useMemo(() => {
    let featuredPost = undefined;
    const postsToRender = [];
    const tags = [];

    for (const post of posts) {
      if (!featuredPost) {
        if (post.isFeatured) {
          featuredPost = post;
        } else {
          postsToRender.push(post);
        }
      } else {
        postsToRender.push(post);
      }

      tags.push(...post.tags);
    }

    return { featuredPost, postsToRender, tags: [...new Set(tags)] };
  }, [posts]);

  return (
    <Fragment>
      <Head>
        <title>HAQQ | Blog</title>
        
        <meta name="description" content="" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HAQQ | Blog" />
        <meta property="og:description" content="" />
        <meta
          property="og:url"
          content={`${new URL('/blog', DEPLOY_URL).toString()}`}
        />
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:title" content="HAQQ | Blog" />
        <meta name="twitter:description" content="" />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <section>
        <TitleBlock />

        <div className="flex flex-col py-[80px]">
          {featuredPost && <FeaturedPostBlock post={featuredPost} />}
          {postsToRender.length > 0 && (
            <PostsBlock posts={postsToRender} tags={tags} />
          )}
        </div>
      </section>
    </Fragment>
  );
}
