import { NewsCard, NewsPost } from '@haqq/islamic-ui-kit';
import clsx from 'clsx';

export function FeaturedPostBlock({
  post,
  className,
}: {
  post: NewsPost;
  className?: string;
}) {
  return (
    <div
      className={clsx('flex flex-col gap-y-[28px] md:gap-y-[48px]', className)}
    >
      <h1 className="text-[22px] font-[600] leading-[24px] md:font-[48px] md:leading-[54px]">
        Featured Post
      </h1>
      <NewsCard post={post} isFeatured />
    </div>
  );
}
