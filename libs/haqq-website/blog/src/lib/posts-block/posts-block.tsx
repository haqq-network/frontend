'use client';
import { Heading, BlogPostCard, BlogTabs } from '@haqq/haqq-website-ui-kit';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import blogPlaceholderImage1 from '../../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/images/blog-post-placeholder-3.png';
import type { StaticImageData } from 'next/image';
import type { Post } from '../blog-page';

export function PostsBlock({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const [tab, setTab] = useState<string>('All posts');

  const filteredPosts = useMemo(() => {
    if (tab === 'All posts') {
      return posts;
    }

    return posts.filter((post) => {
      return post.tags.includes(tab);
    });
  }, [posts, tab]);

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
    <section className="flex flex-col py-[60px]">
      <div className="overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="mb-[28px] flex flex-row items-center gap-x-[38px] md:mb-[42px] md:gap-x-[48px] lg:mb-[56px]">
          <Heading>Recent posts</Heading>
          <div className="relative flex items-center">
            <div className="h-[16px] w-[16px] bg-white" />
            <div className="bg-haqq-border absolute h-[1px] w-[3000px]" />
          </div>
        </div>

        <BlogTabs
          tabs={['All posts', ...tags]}
          current={tab}
          onChange={setTab}
        />

        <div className="mt-[28px] grid grid-cols-1 gap-[28px] md:mt-[36px] md:grid-cols-2 md:gap-[38px] xl:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts?.map((post) => {
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
            })
          ) : (
            <div>no posts</div>
          )}
        </div>
      </div>
    </section>
  );
}
