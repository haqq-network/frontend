'use client';
import { NewsCard, NewsPost } from '@haqq/islamic-website-ui-kit';
import clsx from 'clsx';
import Link from 'next/link';
import { PropsWithChildren, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

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
        'rtl:font-handjet font-vcr cursor-pointer rounded-[8px] px-[12px] py-[8px] text-[14px] font-[400] uppercase leading-[20px] text-white transition-colors duration-300',
        active
          ? 'bg-islamic-primary-green'
          : 'hover:bg-islamic-primary-green/50 bg-transparent',
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

  const t = useTranslations('news-page');

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
        {t('posts.recent')}
      </h2>
      <div className="mt-[28px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] md:mt-[48px] lg:mt-[60px]">
        <NewsTypeButton
          active={activeNewsType === 'all'}
          onClick={() => {
            setActiveNewsType('all');
          }}
        >
          {t('filter-buttons.all')}
        </NewsTypeButton>
        <NewsTypeButton
          active={activeNewsType === 'press'}
          onClick={() => {
            setActiveNewsType('press');
          }}
        >
          {t('filter-buttons.press')}
        </NewsTypeButton>
        <NewsTypeButton
          active={activeNewsType === 'events'}
          onClick={() => {
            setActiveNewsType('events');
          }}
        >
          {t('filter-buttons.events')}
        </NewsTypeButton>
      </div>
      <div className="mt-[28px] grid grid-cols-1 gap-x-[28px] gap-y-[36px] md:grid-cols-2 lg:mt-[36px] lg:grid-cols-3 lg:gap-x-[48px] lg:gap-y-[56px]">
        {filteredPosts.map((post, index) => {
          return (
            <Link
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              key={`news-${index}`}
            >
              <NewsCard post={post} key={index} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
