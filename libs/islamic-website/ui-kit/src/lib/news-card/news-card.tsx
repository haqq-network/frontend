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
  source: string;
  className?: string;
  type: 'press' | 'events';
  isFeatured?: boolean;
}

export type NewsProps = NewsCardProps[];

export function NewsCard({
  date,
  description,
  image,
  title,
  source,
  className,
  type,
  isFeatured = false,
}: NewsCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col bg-transparent',
        isFeatured && 'md:flex-row md:gap-x-[28px]',
        !isFeatured &&
          'w-[234px] md:w-[250px] lg:w-[282px] xl:w-[342px] 2xl:w-[394px]',
        className,
      )}
    >
      <div
        className={clsx(
          'relative h-[250px] w-full',
          isFeatured ? 'md:w-3/5 lg:h-[420px]' : '',
        )}
      >
        {image && (
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            className="h-full w-full rounded-xl object-cover"
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
              'mt-[24px] font-mono text-[10px] font-[400] leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]',
              isFeatured && 'md:mt-0',
            )}
          >
            {source}
          </div>
          <div
            className={clsx(
              'line-clamp-2 text-[18px] font-[700] leading-[26px] text-white md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]',
              isFeatured ? 'mt-[28px]' : 'mt-[8px]',
            )}
          >
            {title}
          </div>
          <div
            className={clsx(
              'line-clamp-3 text-[13px] font-[400] leading-[20px] text-white/50 md:text-[14px] md:leading-[20px] lg:text-base',
              isFeatured ? 'mt-[16px]' : 'mt-[12px]',
            )}
          >
            {description}
          </div>
        </div>
        <div
          className={clsx(
            'mt-[16px] font-mono text-[10px] leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]',
            isFeatured && 'md:mt-0',
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
  );
}
