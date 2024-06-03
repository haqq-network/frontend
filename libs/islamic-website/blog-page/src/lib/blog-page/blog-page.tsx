import { useTranslations } from 'next-intl';
import { SubscribeForm } from '@haqq/islamic-website/forms';
import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { FeaturedPostBlock } from '../featured-post-block/featured-post-block';
import { PostsBlock } from '../posts-block/posts-block';

export type PostType = 'press' | 'events';

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  content?: string;
  description?: string;
  image: { src: string; width: number; height: number } | null;
  isFeatured?: boolean;
  type?: PostType;
  tags: string[];
}

function BlockPageHeader({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const t = useTranslations();

  return (
    turnstileSiteKey && (
      <div className="flex flex-col gap-y-[32px] md:gap-y-[42px] lg:gap-y-[56px]">
        <h1 className="text-start text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-[60px] lg:text-[80px] lg:leading-[80px]">
          {t('blog-page.title')}
        </h1>
        <div className="flex flex-col gap-x-[28px] gap-y-[24px] lg:flex-row lg:items-start">
          <Text size="small">{t('subscribe-form.text')}</Text>
          <SubscribeForm
            className="flex w-full flex-col gap-[16px] md:flex-row"
            inputClassName="lg:min-w-[280px]"
            turnstileSiteKey={turnstileSiteKey}
          />
        </div>
      </div>
    )
  );
}

export function BlogPage({
  turnstileSiteKey,
  featuredPost,
  posts,
  tags,
}: {
  turnstileSiteKey?: string;
  posts: Post[];
  featuredPost: Post | undefined;
  tags: string[];
}) {
  return (
    <section className="flex flex-col items-center pb-[60px] pt-[32px] text-white md:pb-[100px] md:pt-[52px] lg:pb-[140px] lg:pt-[68px]">
      <Container>
        <BlockPageHeader turnstileSiteKey={turnstileSiteKey} />
        {featuredPost && <FeaturedPostBlock post={featuredPost} />}
        {posts.length > 0 && <PostsBlock posts={posts} tags={tags} />}
      </Container>
    </section>
  );
}
