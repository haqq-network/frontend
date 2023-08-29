import clsx from 'clsx';
import Image from 'next/image';

export interface NewsCardProps {
  image: {
    src: string;
    width: number;
    height: number;
  } | null;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  isFeatured?: boolean;
  className?: string;
}

export function NewsCard({
  tags,
  date,
  description,
  image,
  title,
  className,
  isFeatured = false,
}: NewsCardProps) {
  return (
    <div
      className={clsx(
        'flex w-full flex-col',
        'group bg-[#ffffff14] hover:bg-[#FFFFFF26]',
        'transition-color duration-150 ease-out will-change-[color,background]',
        isFeatured && 'md:flex-row',
        className,
      )}
    >
      <div
        className={clsx(
          'relative h-[192px] overflow-hidden',
          isFeatured
            ? 'md:h-[380px] md:w-1/2 lg:h-[420px] lg:w-2/5 xl:w-3/5'
            : 'w-full md:h-[200px] lg:h-[240px]',
        )}
      >
        {image && (
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div
        className={clsx(
          'flex flex-col justify-between gap-y-[12px] p-[16px]',
          isFeatured
            ? 'md:w-1/2 md:px-[28px] md:py-[30px] lg:w-3/5 lg:p-[40px] xl:w-2/5'
            : 'h-[200px] md:h-[243px] lg:h-[274px] lg:px-[20px] lg:py-[24px]',
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
              'text-haqq-orange font-serif text-[16px] font-[500] leading-[1.25em]',
              isFeatured
                ? 'line-clamp-2 md:text-[24px] md:leading-[42px] lg:text-[30px]'
                : 'line-clamp-1 md:text-[18px] lg:text-[24px]',
            )}
          >
            {title}
          </div>
          <div
            className={clsx(
              'line-clamp-4 text-[12px] leading-[1.5em]',
              isFeatured
                ? 'md:line-clamp-5 md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]'
                : 'md:text-[13px] md:leading-[22px] lg:text-[14px]',
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
                  className="border-haqq-border max-w-fit rounded-[2px] border px-[10px] py-[6px] text-center text-[11px] leading-[1.55em] md:leading-[18px] lg:text-[12px]"
                >
                  {tag}
                </div>
              );
            })}
          </div>

          <div
            className={clsx(
              'text-[11px] leading-[1.55em] text-white/50',
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
          </div>
        </div>
      </div>
    </div>
  );
}
