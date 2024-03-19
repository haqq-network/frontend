'use client';
import { useCallback, useMemo, useState } from 'react';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BlogArticle,
  Breadcrumb,
  Container,
} from '@haqq/islamic-website-ui-kit';
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
    <section className="py-[32px] md:py-[60px] lg:py-[80px]">
      <Container>
        <div className="mb-[20px] md:mb-[24px] lg:mb-[32px]">
          <Breadcrumb
            title={post.title}
            backTitle="Posts"
            onBackClick={() => {
              push('/blog');
            }}
          />
        </div>
      </Container>
      <Container>
        <div className="flex flex-col gap-[32px] md:gap-[60px] lg:gap-[80px]">
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
        </div>
      </Container>
    </section>
  );
}
