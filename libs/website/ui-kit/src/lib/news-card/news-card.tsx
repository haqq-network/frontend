import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Key } from 'react';

export type NewsCategory = 'news' | 'technology';

export interface NewsCardProps {
  imageUrl: string;
  title: string;
  content: string;
  date: Date;
  category: NewsCategory;
  className?: string;
  isFeatured?: boolean;
  id: Key;
}

export function NewsCard({
  category,
  date,
  content,
  imageUrl,
  title,
  className,
  isFeatured = false,
  id,
}: NewsCardProps) {
  return (
    <Link href={`/news/${id}`} scroll={false}>
      <div
        className={clsx(
          'flex flex-col w-full',
          isFeatured && 'md:flex-row',
          className,
        )}
      >
        <div
          className={clsx(
            'relative h-[192px]',
            isFeatured
              ? 'md:h-[380px] lg:h-[420px] md:w-1/2 lg:w-2/5 xl:w-3/5'
              : 'md:h-[200px] lg:h-[240px] w-full',
          )}
        >
          <Image src={imageUrl} alt="" fill />
        </div>
        <div
          className={clsx(
            'flex flex-col p-[16px] gap-y-[12px] bg-[#ffffff14] justify-between',
            isFeatured
              ? 'md:w-1/2 lg:w-3/5 xl:w-2/5 md:py-[30px] md:px-[28px] lg:p-[40px]'
              : 'lg:px-[20px] lg:py-[24px] h-[200px] md:h-[243px] lg:h-[274px]',
          )}
        >
          <div
            className={clsx(
              'flex flex-col gap-y-[8px]',
              isFeatured && 'md:gap-y-[16px]',
            )}
          >
            <div
              className={clsx(
                'font-serif font-[500] leading-[1.25em] text-[16px] text-haqq-orange',
                isFeatured
                  ? 'md:text-[24px] md:leading-[42px] lg:text-[30px] line-clamp-2'
                  : 'md:text-[18px] lg:text-[24px] line-clamp-1',
              )}
            >
              {title}
            </div>
            <div
              className={clsx(
                'leading-[1.5em] text-[12px] line-clamp-4',
                isFeatured
                  ? 'md:line-clamp-6 md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]'
                  : 'md:text-[13px] md:leading-[22px] lg:text-[14px]',
              )}
            >
              {content}
            </div>
          </div>

          <div
            className={clsx(
              'flex flex-col gap-y-[8px]',
              isFeatured && 'md:gap-y-[16px]',
            )}
          >
            <div className="px-[10px] py-[6px] rounded-[2px] border border-haqq-border text-[11px] leading-[1.55em] md:leading-[18px] lg:text-[12px] text-center max-w-fit">
              {category === 'news' && 'News'}
              {category === 'technology' && 'Technology'}
            </div>
            <span
              className={clsx(
                'text-white/50 text-[11px] leading-[1.55em]',
                isFeatured
                  ? 'md:text-[13px] md:leading-[22px] lg:text-[14px]'
                  : 'md:leading-[18px] lg:text-[12px]',
              )}
            >
              {new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(date)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
