import { NewsArticle } from '@haqq/website/ui-kit';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronIcon } from '@haqq/website/ui-kit';
import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';

export function PostPage({
  post,
  recentPosts,
}: {
  post: any;
  recentPosts: any[];
}) {
  return (
    <Fragment>
      <Head>
        <title>HAQQ | {post.title}</title>
      </Head>
      <div className="p-[10px] md:px-[80px] border-b border-[#2A2A2B] flex items-center text-[12px] leading-[1.5em] gap-x-[6px]">
        <Link href={'/news'}>Posts</Link>
        <ChevronIcon className="" />
        <div className="truncate text-white/50">{post.title}</div>
      </div>
      <NewsArticle
        id={1} // post.id
        category="news" // post.category
        date="23 may 2023" // post.date
        description={
          '## Our vision – synthesis of ideology, technology, and community\n\n## Islam\n\nIslam is the world’s second-largest religion with almost 2 billion followers — a quarter of the world’s population. Muslims make up a majority of the population in 47 countries. Islam teaches that God is merciful, all-powerful, and unique.\n\nIslamic law, or Shariah law, is a religious law forming part of the Islamic tradition. It guides and dictates many aspects in the lives of Muslims throughout the world, including financial interactions.\n\nOne of the core principles of Islamic financial law is the prohibition of paying or charging interest, which is currently not followed by a large part of financial institutions constituting the modern financial system.\n\nAccording to the [Duck Duck Go](https://duckduckgo.com) <a href="https://www.salaamgateway.com/specialcoverage/SGIE20-21" target="_blank">Global Islamic Economy Report</a>, the volume of the Islamic financial sector was $2.88 trillion in 2020 and is expected to grow to $3.69 trillion by 2024. According to the same report, two of the four main factors influencing the expansion, as well as the Islamic economy in particular, are the rapidly growing Muslim population, the spread of digital technologies, and mobile communications.'
        } // post.description
        title="Test article" // post.title
        imageUrl="/assets/test.png" // post.imageUrl
      />
      <RecentPostsBlock recentPosts={recentPosts} />
    </Fragment>
  );
}
