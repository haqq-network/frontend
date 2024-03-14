'use client';

import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { BlogArticle, Breadcrumb } from '@haqq/islamic-website-ui-kit';
import { Post } from '../blog-page/blog-page';
import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';

export function BlogPostPage({
  post,
  recentPosts,
}: {
  post: Post;
  recentPosts: Post[];
}) {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { push } = useRouter();

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setIsLinkCopied(true);
  }, []);

  return (
    <section>
      <div
        className={clsx(
          'overflow-clip px-[16px] sm:px-[48px] lg:px-[80px] lg:pt-[32px]',
          'bg-haqq-black transform-gpu backdrop-blur',
          'sticky top-[63px] z-40 sm:top-[72px] ',
        )}
      >
        <Breadcrumb
          title={post.title}
          backTitle="Posts"
          onBackClick={() => {
            push('/blog');
          }}
        />
      </div>

      <BlogArticle
        tags={post.tags}
        publishDate={post.date}
        content={post.content ?? ''}
        title={post.title}
        onLinkCopy={copyLink}
        isLinkCopied={isLinkCopied}
      />

      <RecentPostsBlock recentPosts={recentPosts} />
    </section>
  );
}
