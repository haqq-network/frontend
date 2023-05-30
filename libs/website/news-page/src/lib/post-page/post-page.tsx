import { NewsArticle, Breadcrumb } from '@haqq/website/ui-kit';
import Head from 'next/head';
import { Fragment, useCallback } from 'react';

type PostPageProps = {
  post: any;
  recentPosts: any[];
};

export function PostPage({ post, recentPosts }: PostPageProps) {
  const copyLink = useCallback((): void => {
    console.log('copyLink');
  }, []);

  return (
    <Fragment>
      <Head>
        {post?.title ? (
          <title>HAQQ | {post.title}</title>
        ) : (
          <title>HAQQ | News</title>
        )}
      </Head>

      <div className="border-b border-[#2A2A2B] px-[16px] sm:px-[63px] lg:px-[79px] overflow-clip">
        <Breadcrumb
          title={post.title}
          onBackClick={() => console.log('backclick')}
        />
      </div>

      <NewsArticle
        tags={post.tags}
        date={post.date}
        content={post.content}
        title={post.title}
        image={post.image}
        onLinkCopy={copyLink}
      />

      {/* <RecentPostsBlock recentPosts={recentPosts} /> */}
    </Fragment>
  );
}
