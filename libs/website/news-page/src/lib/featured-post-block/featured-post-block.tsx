import { Heading, NewsCard } from '@haqq/website/ui-kit';

export function FeaturedPostBlock() {
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
        category="technology"
        date="May 26 2023"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. AenLorem ipsum dolor sit amet, consectetur adipiscing elit. Aen"
        imageUrl="/assets/test.png"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        isFeatured
        className="mt-[56px]"
      />
    </section>
  );
}
