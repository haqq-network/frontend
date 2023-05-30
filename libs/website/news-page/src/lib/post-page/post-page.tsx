import {
  NewsArticle,
  NewsBreadcrumb,
  NewsCardProps,
} from '@haqq/website/ui-kit';
import Head from 'next/head';
import { Fragment, useCallback } from 'react';
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
      <NewsBreadcrumb
        title={post.title}
        onBackClick={() => console.log('backclick')}
      />
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
