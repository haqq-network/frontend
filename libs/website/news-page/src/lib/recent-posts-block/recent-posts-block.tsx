import { Heading, NewsCard } from '@haqq/website/ui-kit';

export function RecentPostsBlock({ recentPosts }: { recentPosts: any[] }) {
  return (
    <section className="flex flex-col items-start px-[16px] pb-[48px] md:pb-[68px] md:px-[48px] lg:px-[110px] lg:pb-[100px] 2xl:px-[320px]">
      <Heading level={3}>Recent posts</Heading>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[28px] md:gap-[38px] mt-[28px] lg:mt-[32px]">
        {recentPosts.map((post) => (
          <NewsCard
            key={post.id}
            title={post.title}
            imageUrl={post.imageUrl}
            id={post.id}
            description={post.description}
            date={post.date}
            category={post.category}
          />
        ))}
      </div>
    </section>
  );
}
