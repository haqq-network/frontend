import { Heading, NewsCard, NewsCardProps } from '@haqq/website/ui-kit';

export function FeaturedPostBlock(post: NewsCardProps) {
  return (
    <section className="flex flex-col pt-[68px] px-[16px] pb-[48px] md:pb-[78px] md:pt-[100px] md:px-[48px] lg:pt-[140px] lg:px-[80px] lg:pb-[120px]">
      <div className="flex gap-x-[38px] md:gap-x-[48px]">
        <Heading>Featured post</Heading>
        <div className="flex items-center relative">
          <div className="bg-white w-[16px] h-[16px]" />
          <div className="h-[1px] w-[3000px] bg-haqq-border absolute" />
        </div>
      </div>
      <NewsCard
        category={post.category}
        date={post.date}
        content={post.content}
        imageUrl={post.imageUrl}
        title={post.title}
        isFeatured={post.isFeatured}
        id={post.id}
        className="mt-[56px]"
      />
    </section>
  );
}
