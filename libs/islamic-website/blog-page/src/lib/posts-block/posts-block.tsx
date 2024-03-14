'use client';

import { useCallback, useMemo, useState } from 'react';
import type { StaticImageData } from 'next/image';
import Link from 'next/link';
import { BlogPostCard, Tabs } from '@haqq/islamic-website-ui-kit';
import blogPlaceholderImage1 from '../../assets/images/blog-post-placeholder-1.png';
import blogPlaceholderImage2 from '../../assets/images/blog-post-placeholder-2.png';
import blogPlaceholderImage3 from '../../assets/images/blog-post-placeholder-3.png';
import type { Post } from '../blog-page/blog-page';

export function PostsBlock({ posts, tags }: { posts: Post[]; tags: string[] }) {
  const [tab, setTab] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    if (tab === 'all') {
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
    <section className="mt-[60px] flex flex-col py-[60px] md:mt-[110px] lg:mt-[140px]">
      <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
        Recent posts
      </h2>

      <Tabs
        tabs={['all', ...tags]}
        current={tab}
        onChange={setTab}
        className="mt-[28px] md:mt-[38px] lg:mt-[48px]"
      />

      <div className="mt-[28px] grid grid-cols-1 gap-[28px] md:mt-[36px] md:grid-cols-2 md:gap-[40px] lg:grid-cols-3 lg:gap-[48px]">
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
          <h2 className="font-alexandria text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
            No posts
          </h2>
        )}
      </div>
    </section>
  );
}
