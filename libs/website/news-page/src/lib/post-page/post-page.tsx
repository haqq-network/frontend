import { NewsArticle, Breadcrumb } from '@haqq/website/ui-kit';
import Head from 'next/head';
import { Fragment, useCallback } from 'react';
// import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';
import { useRouter } from 'next/router';

type PostPageProps = {
  post: any;
  recentPosts: any[];
};

export function PostPage({ post, recentPosts }: PostPageProps) {
  const { push } = useRouter();
  const copyLink = useCallback((): void => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>HAQQ | Blog | {post.title}</title>
      </Head>

      <div className="overflow-clip border-b border-[#2A2A2B] px-[16px] sm:px-[63px] lg:px-[79px]">
        <Breadcrumb
          title={post.title}
          onBackClick={() => {
            push('/blog');
          }}
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
