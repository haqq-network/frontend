'use client';
import { NewsCard, NewsPost } from '@haqq/islamic-ui-kit';
import clsx from 'clsx';
import Link from 'next/link';
import { PropsWithChildren, useMemo, useState } from 'react';

function NewsTypeButton({
  children,
  active,
  onClick,
}: PropsWithChildren<{
  active: boolean;
  onClick: () => void;
}>) {
  return (
    <div
      className={clsx(
        'hover:bg-islamic-primary-green-hover cursor-pointer rounded-[8px] px-[12px] py-[8px] font-mono text-[14px] font-[400] uppercase leading-[20px] text-white transition-colors duration-150',
        active ? 'bg-islamic-primary-green' : 'bg-transparent',
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function PostsBlock({
  posts,
  className,
}: {
  posts: NewsPost[];
  className?: string;
}) {
  const [activeNewsType, setActiveNewsType] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    if (activeNewsType === 'all') {
      return posts;
    }

    return posts.filter((post) => {
      return post.type === activeNewsType;
    });
  }, [activeNewsType, posts]);

  return (
    <div className={clsx('flex flex-col', className)}>
      <h2 className="text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
        Recent Posts
      </h2>
      <div className="mt-[28px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] md:mt-[48px] lg:mt-[60px]">
        <NewsTypeButton
          active={activeNewsType === 'all'}
          onClick={() => {
            setActiveNewsType('all');
          }}
        >
          All
        </NewsTypeButton>
        <NewsTypeButton
          active={activeNewsType === 'press'}
          onClick={() => {
            setActiveNewsType('press');
          }}
        >
          Press
        </NewsTypeButton>
        <NewsTypeButton
          active={activeNewsType === 'events'}
          onClick={() => {
            setActiveNewsType('events');
          }}
        >
          Events
        </NewsTypeButton>
      </div>
      <div className="mt-[28px] grid grid-cols-1 gap-[28px] md:grid-cols-2 lg:mt-[36px] lg:grid-cols-3 lg:gap-[48px]">
        {filteredPosts.map((post, index) => {
          return (
            <Link href={post.url} target="_blank" rel="noopener noreferrer">
              <NewsCard post={post} key={index} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
