import { Heading, NewsCard } from '@haqq/haqq-website-ui-kit';
import Link from 'next/link';
import { Post } from '../blog-page/blog-page';

export function RecentPostsBlock({ recentPosts }: { recentPosts: Post[] }) {
  return (
    <section className="flex flex-col items-start pb-[48px] md:pb-[68px] lg:pb-[100px]">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="mx-auto max-w-4xl">
          <div className="mt-[28px] lg:mt-[32px]">
            <Heading level={3}>Recent posts</Heading>
          </div>

          <div className="grid w-full grid-cols-1 gap-[28px] md:grid-cols-2 md:gap-[38px]">
            {recentPosts.map((post) => {
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <NewsCard
                    date={new Date(post.date)}
                    description={post.description ?? ''}
                    image={post.image}
                    title={post.title}
                    tags={post.tags}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
