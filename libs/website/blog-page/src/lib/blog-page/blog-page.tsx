import { TitleBlock } from '../title-block/title-block';
import { Fragment, useMemo } from 'react';
import Head from 'next/head';
import { PostsBlock } from '../posts-block/posts-block';
import { FeaturedPostBlock } from '../featured-post-block/featured-post-block';

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
        <meta
          property="og:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
        <meta
          name="twitter:image"
          content={`${new URL(DEPLOY_URL)}opengraph-image.png`}
        />
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
