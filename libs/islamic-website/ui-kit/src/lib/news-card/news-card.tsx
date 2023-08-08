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
}

export function NewsCard({
  date,
  description,
  image,
  title,
  source,
  className,
}: NewsCardProps) {
  return (
    <div
      className={clsx(
        'flex w-[234px] flex-col bg-transparent md:w-[250px] lg:w-[282px] xl:w-[342px] 2xl:w-[394px]',
        className,
      )}
    >
      <div className="relative h-[250px] w-full">
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
      <div className="mt-[28px] font-mono text-[10px] font-[400] leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]">
        {source}
      </div>
      <div className="mt-[8px] line-clamp-2 text-[18px] font-[700] leading-[26px] text-white md:text-[22px] md:leading-[32px] lg:text-[24px] lg:leading-[34px]">
        {title}
      </div>
      <div className="mt-[12px] line-clamp-3 text-[13px] font-[400] leading-[20px] text-white/50 md:text-[14px] md:leading-[20px] lg:text-base">
        {description}
      </div>
      <div className="mt-[12px] font-mono text-[10px] leading-[16px] text-[#838383] md:text-[11px] md:leading-[18px] lg:text-[12px]">
        {new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(date)}
      </div>
    </div>
  );
}
