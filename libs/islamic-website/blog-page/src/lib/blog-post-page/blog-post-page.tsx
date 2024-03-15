'use client';

import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { BlogArticle, Breadcrumb } from '@haqq/islamic-website-ui-kit';
import blogPlaceholderImage1 from '../../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/images/blog-post-placeholder-3.png';
import { Post } from '../blog-page/blog-page';
import { RecentPostsBlock } from '../recent-posts-block/recent-posts-block';

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
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { push } = useRouter();

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setIsLinkCopied(true);
  }, []);

  const postImage = useMemo(() => {
    if (post.image) {
      return post.image;
    }

    const index = new Date(post.date).getTime() % 3;
    const placeholderImage = placeholderImagesArray[index];

    return placeholderImage;
  }, [post.date, post.image]);

  return (
    <section>
      <div
        className={clsx(
          'overflow-clip px-[16px] md:px-[48px] xl:px-[80px]',
          'transform-gpu backdrop-blur',
          'sticky top-[160px] z-40 min-[375px]:top-[134px] md:top-[112px] lg:top-[116px]',
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
        image={postImage as StaticImageData | null}
      />

      <RecentPostsBlock recentPosts={recentPosts} />
    </section>
  );
}
