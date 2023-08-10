'use client';
import { NewsCard, NewsProps } from '@haqq/islamic-ui-kit';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';

function NewsTypeButton({
  active,
  type = 'all',
  onClick,
}: {
  active: boolean;
  type: 'all' | 'press' | 'events';
  onClick: () => void;
}) {
  return (
    <div
      className={clsx(
        'hover:bg-islamic-primary-green-hover cursor-pointer rounded-[8px] px-[12px] py-[8px] font-mono text-[14px] font-[400] uppercase leading-[20px] text-white transition-colors duration-150',
        active ? 'bg-islamic-primary-green' : 'bg-transparent',
      )}
      onClick={onClick}
    >
      {type === 'press' && 'Press'}
      {type === 'events' && 'Events'}
      {type === 'all' && 'All'}
    </div>
  );
}

export function PostsBlock({
  posts,
  className,
}: {
  posts: NewsProps;
  className?: string;
}) {
  const [activeNewsType, setActiveNewsType] = useState<
    'all' | 'press' | 'events'
  >('all');

  const handleLangChange = useCallback((type: 'all' | 'press' | 'events') => {
    setActiveNewsType(type);
  }, []);

  const { eventsPosts, pressPosts } = useMemo(() => {
    const eventsPosts = posts.filter((post) => {
      return post.type === 'events';
    });
    const pressPosts = posts.filter((post) => {
      return post.type === 'press';
    });
    return { eventsPosts, pressPosts };
  }, [posts]);

  console.log({ eventsPosts, pressPosts });

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="text-[46px] font-[600] leading-[52px] md:font-[48px] md:leading-[54px]">
        Recent Posts
      </div>
      <div className="mt-[28px] flex w-fit items-center gap-x-[8px] rounded-[10px] bg-[#2F2F2F] p-[6px] md:mt-[48px] lg:mt-[60px]">
        <NewsTypeButton
          active={activeNewsType === 'all'}
          type="all"
          onClick={() => {
            return handleLangChange('all');
          }}
        />
        <NewsTypeButton
          active={activeNewsType === 'press'}
          type="press"
          onClick={() => {
            return handleLangChange('press');
          }}
        />
        <NewsTypeButton
          active={activeNewsType === 'events'}
          type="events"
          onClick={() => {
            return handleLangChange('events');
          }}
        />
      </div>
      <div className="mt-[28px] grid grid-cols-1 gap-[28px] md:grid-cols-2 lg:mt-[36px] lg:grid-cols-3 lg:gap-[48px]">
        {activeNewsType === 'all' &&
          posts.length > 0 &&
          posts.map((post, index) => {
            return (
              <NewsCard
                date={post.date}
                description={post.description}
                image={post.image}
                title={post.title}
                source={post.source}
                type={post.type}
                key={index}
              />
            );
          })}
        {activeNewsType === 'press' &&
          pressPosts.length > 0 &&
          pressPosts.map((post, index) => {
            return (
              <NewsCard
                date={post.date}
                description={post.description}
                image={post.image}
                title={post.title}
                source={post.source}
                type={post.type}
                key={index}
              />
            );
          })}
        {activeNewsType === 'events' &&
          eventsPosts.length > 0 &&
          eventsPosts.map((post, index) => {
            return (
              <NewsCard
                date={post.date}
                description={post.description}
                image={post.image}
                title={post.title}
                source={post.source}
                type={post.type}
                key={index}
              />
            );
          })}
      </div>
    </div>
  );
}
