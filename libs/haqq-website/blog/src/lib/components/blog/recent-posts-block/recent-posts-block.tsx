import { Heading, BlogPostCard } from '@haqq/haqq-website-ui-kit';
import { Post } from '../../../blog-page';
import Link from 'next/link';
import { useCallback } from 'react';
import blogPlaceholderImage1 from '../../../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../../../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../../../assets/images/blog-post-placeholder-3.png';
import type { StaticImageData } from 'next/image';

export function RecentPostsBlock({ recentPosts }: { recentPosts: Post[] }) {
  const getPostImage = useCallback((post: Post) => {
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
  }, []);

  return (
    <section className="flex flex-col items-start pb-[48px] md:pb-[68px] lg:pb-[100px]">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="mx-auto max-w-4xl xl:max-w-5xl">
          <div className="mb-[28px] lg:mb-[32px]">
            <Heading level={3}>Recent posts</Heading>
          </div>

          <div className="grid w-full grid-cols-1 gap-[28px] md:grid-cols-2 md:gap-[38px]">
            {recentPosts.map((post) => {
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <BlogPostCard
                    date={new Date(post.date)}
                    description={post.description ?? ''}
                    image={getPostImage(post)}
                    title={post.title}
                    tags={post.tags}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
