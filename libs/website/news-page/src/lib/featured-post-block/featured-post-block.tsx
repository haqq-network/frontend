import { Heading, NewsCard } from '@haqq/website/ui-kit';
import Link from 'next/link';

export function FeaturedPostBlock({ post }: { post: any }) {
  return (
    <section className="flex flex-col py-[60px]">
      <div className="overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="mb-[28px] flex flex-row items-center gap-x-[38px] md:mb-[42px] md:gap-x-[48px] lg:mb-[56px]">
          <Heading>Featured post</Heading>
          <div className="relative flex items-center">
            <div className="h-[16px] w-[16px] bg-white" />
            <div className="bg-haqq-border absolute h-[1px] w-[3000px]" />
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
