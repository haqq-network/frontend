import { Heading, NewsCard, BlogTabs } from '@haqq/website/ui-kit';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export function PostsBlock({ posts, tags }: { posts: any[]; tags: string[] }) {
  const [tab, setTab] = useState<string>('All posts');

  const filteredPosts = useMemo(() => {
    if (tab === 'All posts') {
      return posts;
    }

    return posts.filter((post) => {
      return post.tags.includes(tab);
    });
  }, [posts, tab]);

  return (
    <section className="flex flex-col py-[60px]">
      <div className="px-[16px] sm:px-[63px] lg:px-[79px] overflow-clip">
        <div className="flex flex-row items-center gap-x-[38px] md:gap-x-[48px] mb-[28px] md:mb-[42px] lg:mb-[56px]">
          <Heading>Recent posts</Heading>
          <div className="flex items-center relative">
            <div className="bg-white w-[16px] h-[16px]" />
            <div className="h-[1px] w-[3000px] bg-haqq-border absolute" />
          </div>
        </div>

        <BlogTabs
          tabs={['All posts', ...tags]}
          current={tab}
          onChange={setTab}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[28px] md:gap-[38px] mt-[28px] md:mt-[36px]">
          {filteredPosts.length > 0 ? (
            filteredPosts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <NewsCard
                  date={new Date(post.date)}
                  description={post.description}
                  image={post.image}
                  title={post.title}
                  tags={post.tags}
                />
              </Link>
            ))
          ) : (
            <div>no posts</div>
          )}
        </div>
      </div>
    </section>
  );
}
