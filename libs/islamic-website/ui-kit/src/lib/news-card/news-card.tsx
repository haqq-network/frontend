import clsx from 'clsx';
import Image from 'next/image';

export interface NewsPost {
  image: {
    src: string;
    width: number;
    height: number;
  } | null;
  title: string;
  description: string;
  date: Date;
  source: string;
  type: 'press' | 'events';
  isFeatured?: boolean;
  url: string;
}

export function NewsCard({
  post,
  className,
  isFeatured,
}: {
  post: NewsPost;
  className?: string;
  isFeatured?: boolean;
}) {
  return (
    <div
      className={clsx(
        'group flex w-full flex-col bg-transparent',
        'min-w-[234px] md:min-w-[249px]',
        isFeatured && 'md:flex-row md:gap-x-[28px]',
        className,
      )}
    >
      <div
        className={clsx(
          'relative h-[250px] w-full overflow-hidden rounded-[12px] border-[1px] border-[#2F2F2F]',
          isFeatured && 'md:h-[420px] md:w-3/5',
        )}
      >
        {post.image && (
          <Image
            src={post.image.src}
            width={post.image.width}
            height={post.image.height}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-110"
          />
        )}
      </div>
      <div
        className={clsx(
          'flex flex-col justify-between',
          isFeatured ? 'md:w-2/5' : '',
        )}
      >
        <div className="flex flex-col">
          <div
            className={clsx(
              'font-vcr mt-[24px] text-[10px] font-[400] uppercase leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]',
              isFeatured && 'md:mt-0',
            )}
          >
            {post.source}
          </div>
          <div
            className={clsx(
              'line-clamp-2 text-[18px] font-[700] leading-[26px] text-white md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]',
              'group-hover:text-islamic-primary-green-hover transition-colors duration-200 ease-out',
              isFeatured ? 'mt-[28px]' : 'mt-[8px]',
            )}
          >
            {post.title}
          </div>
          <div
            className={clsx(
              'line-clamp-3 text-[13px] font-[400] leading-[20px] text-white/50 md:text-[14px] md:leading-[20px] lg:text-base',
              isFeatured ? 'mt-[16px]' : 'mt-[12px]',
            )}
          >
            {post.description}
          </div>
        </div>
        <div
          className={clsx(
            'font-vcr mt-[16px] text-[10px] uppercase leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]',
            isFeatured && 'md:mt-0',
          )}
        >
          {new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(post.date)}
        </div>
      </div>
    </div>
  );
}
