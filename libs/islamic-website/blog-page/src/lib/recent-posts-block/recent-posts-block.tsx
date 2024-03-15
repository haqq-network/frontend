import { useCallback } from 'react';
import type { StaticImageData } from 'next/image';
import Link from 'next/link';
import { BlogPostCard } from '@haqq/islamic-website-ui-kit';
import blogPlaceholderImage1 from '../../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/images/blog-post-placeholder-3.png';
import { Post } from '../blog-page/blog-page';

export function RecentPostsBlock({ recentPosts }: { recentPosts: Post[] }) {
  const getPostImage = useCallback((post: Post) => {
    if (post.image) {
      return post.image;
    }

    const imagesArray = [
      blogPlaceholderImage1,
      blogPlaceholderImage2,
      blogPlaceholderImage3,
    ] as unknown[];
    const index = new Date(post.date).getTime() % 3;
    const placeholderImage = imagesArray[index];

    return placeholderImage;
  }, []);

  return (
    <section className="flex flex-col items-start pb-[48px] md:pb-[68px] lg:pb-[100px]">
      <div className="w-full overflow-clip px-[16px] md:px-[48px] xl:px-[80px]">
        <div className="mx-auto max-w-4xl xl:max-w-5xl">
          <div className="mb-[28px] lg:mb-[32px]">
            <h2 className="ltr:font-vcr rtl:font-handjet text-[17px] uppercase leading-[26px] md:text-[18px] lg:text-[20px] lg:leading-[28px]">
              Related articles
            </h2>
          </div>

          <div className="grid w-full grid-cols-1 gap-[28px] md:grid-cols-2 md:gap-[38px]">
            {recentPosts.map((post) => {
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <BlogPostCard
                    date={new Date(post.date)}
                    description={post.description ?? ''}
                    image={getPostImage(post) as StaticImageData}
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
