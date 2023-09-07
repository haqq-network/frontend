'use client';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BlogArticle, Breadcrumb } from '@haqq/haqq-website-ui-kit';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import blogPlaceholderImage1 from '../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../assets/images/blog-post-placeholder-3.png';
import type { Post } from './blog-page';
import type { StaticImageData } from 'next/image';
import { RecentPostsBlock } from '../components/blog/recent-posts-block/recent-posts-block';

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

    const imagesArray = [
      blogPlaceholderImage1 as unknown,
      blogPlaceholderImage2 as unknown,
      blogPlaceholderImage3 as unknown,
    ] as StaticImageData[];
    const index = new Date(post.date).getTime() % 3;
    const placeholderImage = imagesArray[index];

    return placeholderImage;
  }, [post.date, post.image]);

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
        date={post.date}
        content={post.content ?? ''}
        title={post.title}
        image={postImage}
        onLinkCopy={copyLink}
      />

      <RecentPostsBlock recentPosts={recentPosts} />
    </section>
  );
}
