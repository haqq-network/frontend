import { NewsArticle, NewsCardProps } from '@haqq/website/ui-kit';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useCallback } from 'react';
import { ChevronIcon } from '@haqq/website/ui-kit';
import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';
import { useRouter } from 'next/router';

export type Post = Omit<NewsCardProps, 'isFeatured' | 'className'>;

type PostPageProps = {
  post: Post;
  recentPosts: Post[];
};

export function PostPage({ post, recentPosts }: PostPageProps) {
  const router = useRouter();

  const BASE_URL = 'https://haqq.network';

  const link = `${BASE_URL}${router.asPath}`;

  const copyLink = useCallback((): void => {
    navigator.clipboard.writeText(link);
  }, [link]);

  return (
    <Fragment>
      <Head>
        {post?.title ? (
          <title>HAQQ | {post.title}</title>
        ) : (
          <title>HAQQ | News</title>
        )}
      </Head>
      <div className="p-[10px] md:px-[80px] border-b border-[#2A2A2B] flex items-center text-[12px] leading-[1.5em] gap-x-[6px]">
        <Link href={'/news'}>Posts</Link>
        <ChevronIcon className="" />
        <div className="truncate text-white/50">{post?.title}</div>
      </div>
      <NewsArticle
        id={post.id}
        category={post.category}
        date={post.date}
        content={post.content}
        title={post.title}
        imageUrl={post.imageUrl}
        onLinkCopy={copyLink}
      />
      <RecentPostsBlock recentPosts={recentPosts} />
    </Fragment>
  );
}
