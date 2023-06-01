import { Heading, NewsCard } from '@haqq/website/ui-kit';
import Link from 'next/link';

export function RecentPostsBlock({ recentPosts }: { recentPosts: any[] }) {
  return (
    <section className="flex flex-col items-start pb-[48px] md:pb-[68px] lg:pb-[100px]">
      <div className="px-[16px] sm:px-[63px] lg:px-[79px] overflow-clip w-full">
        <div className="max-w-4xl mx-auto">
          <div className="mt-[28px] lg:mt-[32px]">
            <Heading level={3}>Recent posts</Heading>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[28px] md:gap-[38px]">
            {recentPosts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <NewsCard
                  date={new Date(post.date)}
                  description={post.description}
                  image={post.image}
                  title={post.title}
                  tags={post.tags}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
