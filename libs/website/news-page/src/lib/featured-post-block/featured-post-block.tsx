import { Heading, NewsCard } from '@haqq/website/ui-kit';
import Link from 'next/link';

export function FeaturedPostBlock({ post }: { post: any }) {
  return (
    <section className="flex flex-col py-[60px]">
      <div className="px-[16px] sm:px-[63px] lg:px-[79px] overflow-clip">
        <div className="flex flex-row items-center gap-x-[38px] md:gap-x-[48px] mb-[28px] md:mb-[42px] lg:mb-[56px]">
          <Heading>Featured post</Heading>
          <div className="flex items-center relative">
            <div className="bg-white w-[16px] h-[16px]" />
            <div className="h-[1px] w-[3000px] bg-haqq-border absolute" />
          </div>
        </div>

        <div>
          <Link href={`/blog/${post.slug}`}>
            <NewsCard
              date={new Date(post.date)}
              description={post.description}
              image={post.image}
              title={post.title}
              tags={post.tags}
              isFeatured
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
