import { NewsCard, NewsCardProps } from '@haqq/islamic-ui-kit';
import clsx from 'clsx';

export function FeaturedPostBlock({
  post,
  className,
}: {
  post: NewsCardProps;
  className?: string;
}) {
  return (
    <div
      className={clsx('flex flex-col gap-y-[28px] md:gap-y-[48px]', className)}
    >
      <div className="text-[46px] font-[600] leading-[52px] md:font-[48px] md:leading-[54px]">
        Featured Post
      </div>
      <NewsCard {...post} isFeatured />
    </div>
  );
}
