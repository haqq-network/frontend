import { NewsArticle, Breadcrumb } from '@haqq/website/ui-kit';
import Head from 'next/head';
import { Fragment, useCallback, useState } from 'react';
// import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

type PostPageProps = {
  post: any;
  recentPosts: any[];
};

export function PostPage({ post, recentPosts }: PostPageProps) {
  const { push } = useRouter();
  // const [isLinkCopied, setIsLinkCopied] = useState(false);

  const copyLink = useCallback(async () => {
    const copyPromise = navigator.clipboard.writeText(window.location.href);

    toast.promise(copyPromise, {
      loading: 'Copy link in progress',
      success: () => {
        return `The link was copied!`;
      },
      error: (error) => {
        return error.message;
      },
    });
  }, []);

  return (
    <Fragment>
      <Head>
        <title>HAQQ | Blog | {post.title}</title>
      </Head>

      <div className="border-b border-[#2A2A2B] px-[16px] sm:px-[63px] lg:px-[79px] overflow-clip">
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
