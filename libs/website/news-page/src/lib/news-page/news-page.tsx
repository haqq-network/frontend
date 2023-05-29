import { NewsCard } from '@haqq/website/ui-kit';
import { TitleBlock } from '../title-block/title-block';
import { FeaturedPostBlock } from '../featured-post-block/featured-post-block';
import { Fragment } from 'react';
import Head from 'next/head';
import { PostsBlock } from '../posts-block/posts-block';

export function NewsPage({ posts }) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | News</title>
      </Head>
      <TitleBlock />
      <FeaturedPostBlock />
      <PostsBlock posts={posts} />
    </Fragment>
  );
}
