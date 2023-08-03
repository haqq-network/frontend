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
        'flex min-w-[234px] max-w-[400px] flex-col bg-transparent md:min-w-[250px] lg:min-w-[282px] xl:min-w-[342px]',
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
      <div className="mt-[28px] text-[#838383]">{source}</div>
      <div className="mt-[8px] line-clamp-2 text-[24px] font-[700] leading-[34px] text-white">
        {title}
      </div>
      <div className="mt-[12px] line-clamp-3 text-[16px] font-[400] leading-[1.5em] text-[#555555]">
        {description}
      </div>
      <div className="mt-[12px] text-[12px] leading-[1.5em] text-[#838383]">
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
