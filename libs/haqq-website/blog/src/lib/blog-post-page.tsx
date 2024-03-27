'use client';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BlogArticle, Breadcrumb } from '@haqq/haqq-website-ui-kit';
import type { Post } from './blog-page';
import { RecentPostsBlock } from './recent-posts-block/recent-posts-block';
import blogPlaceholderImage1 from '../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../assets/images/blog-post-placeholder-3.png';

const placeholderImagesArray = [
  blogPlaceholderImage1,
  blogPlaceholderImage2,
  blogPlaceholderImage3,
];

export function BlogPostPage({
  post,
  recentPosts,
}: {
  post: Post;
  recentPosts: Post[];
}) {
  const { push } = useRouter();

  const copyLink = useCallback(() => {
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

  const postImage = useMemo(() => {
    if (post.image) {
      return post.image;
    }

    const index = new Date(post.date).getTime() % 3;
    const placeholderImage = placeholderImagesArray[index];

    return placeholderImage;
  }, [post.date, post.image]);

  const transformImageUrl = useCallback((src: string) => {
    return `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=80`;
  }, []);

  return (
    <section>
      <div
        className={clsx(
          'overflow-clip border-b border-[#2A2A2B] px-[16px] sm:px-[63px] lg:px-[79px]',
          'bg-haqq-black transform-gpu backdrop-blur',
          'sticky top-[63px] z-40 sm:top-[72px]',
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
        image={postImage}
        onLinkCopy={copyLink}
        transformImageUrl={transformImageUrl}
        articleLink={new URL(
          `/blog/${post.slug}`,
          'https://haqq.network',
        ).toString()}
      />

      <RecentPostsBlock recentPosts={recentPosts} />
    </section>
  );
}
