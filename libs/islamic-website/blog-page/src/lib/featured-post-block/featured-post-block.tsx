import { useMemo } from 'react';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import { BlogPostCard } from '@haqq/islamic-website-ui-kit';
import blogPlaceholderImage1 from '../../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/images/blog-post-placeholder-3.png';
import { Post } from '../blog-page/blog-page';

export function FeaturedPostBlock({ post }: { post: Post }) {
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
    <div className="mt-[60px] flex flex-col gap-y-[28px] md:mt-[100px] md:gap-y-[38px] lg:mt-[140px] lg:gap-y-[48px]">
      <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
        Featured post
      </h2>
      <Link href={`/blog/${post.slug}`}>
        <BlogPostCard
          date={new Date(post.date)}
          description={post.description ?? ''}
          image={postImage}
          title={post.title}
          tags={post.tags}
          isFeatured
        />
      </Link>
    </div>
  );
}
