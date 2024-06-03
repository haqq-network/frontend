import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';

export interface BlogPostCardProps {
  image: StaticImageData | null;
  title: string;
  description: string;
  date: Date;
  isFeatured?: boolean;
  className?: string;
  tags: string[];
}

export function BlogPostCard({
  tags,
  date,
  description,
  image,
  title,
  className,
  isFeatured = false,
}: BlogPostCardProps) {
  return (
    <div
      className={clsx(
        'group flex w-full flex-col gap-[24px] md:gap-[28px]',
        isFeatured && 'md:flex-row',
        className,
      )}
    >
      <div
        className={clsx(
          'relative h-[249px] overflow-hidden rounded-[12px] border border-[#2F2F2F]',
          isFeatured
            ? 'md:h-[380px] md:w-1/2 lg:h-[420px] lg:w-2/5 xl:w-3/5'
            : 'w-full',
        )}
      >
        {image && (
          <Image
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div
        className={clsx(
          'flex flex-col justify-between gap-y-[12px]',
          isFeatured
            ? 'md:w-1/2 lg:w-3/5 xl:w-2/5'
            : 'h-[190px] md:h-[208px] lg:h-[230px]',
        )}
      >
        <div
          className={clsx(
            'flex flex-col gap-y-[8px] md:gap-y-[12px]',
            isFeatured && 'md:gap-y-[16px]',
          )}
        >
          <div
            className={clsx(
              'font-alexandria',
              'line-clamp-2 text-[18px] font-[700] leading-[26px] md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]',
              'group-hover:text-islamic-primary-green-hover transition-colors duration-200 ease-out',
            )}
          >
            {title}
          </div>
          <div
            className={clsx(
              'font-alexandria text-[12px] leading-[1.5em] text-white/50',
              isFeatured
                ? 'md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]'
                : 'line-clamp-3 md:text-[13px] md:leading-[22px] lg:text-[14px]',
            )}
          >
            {description}
          </div>
        </div>

        <div
          className={clsx(
            'flex flex-col gap-y-[8px]',
            isFeatured && 'md:gap-y-[16px]',
          )}
        >
          <div className="flex flex-row flex-wrap gap-[6px]">
            {tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className="font-vcr rtl:font-handjet max-w-fit rounded-[8px] border border-[#585858] px-[10px] py-[6px] text-center text-[12px] uppercase leading-[1.5em]"
                >
                  {tag}
                </div>
              );
            })}
          </div>
          <div className="font-vcr rtl:font-handjet text-[10px] font-[400] uppercase leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]">
            {new Intl.DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            }).format(date)}
          </div>
        </div>
      </div>
    </div>
  );
}
