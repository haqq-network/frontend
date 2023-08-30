import { Container, NewsCard, NewsPost, Text } from '@haqq/islamic-ui-kit';
import { useMemo } from 'react';
import { PostsBlock } from '../posts-block/posts-block';
import { SubscribeForm } from '@haqq/islamic-website/forms';

export function NewsPage({
  news,
  turnstileSiteKey,
}: {
  news: NewsPost[];
  turnstileSiteKey?: string;
}) {
  const { featuredPost, postsToRender } = useMemo(() => {
    let featuredPost = undefined;
    const postsToRender = [];

    for (const post of news) {
      if (!featuredPost) {
        if (post.isFeatured) {
          featuredPost = post;
        } else {
          postsToRender.push(post);
        }
      } else {
        postsToRender.push(post);
      }
    }

    return { featuredPost, postsToRender };
  }, [news]);

  return (
    <div className="flex flex-col pb-[60px] pt-[32px] text-white md:pb-[100px] md:pt-[52px] lg:pb-[140px] lg:pt-[68px]">
      <Container>
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          Islamic Coin Press & News
        </h1>

        {turnstileSiteKey && (
          <div className="mt-[32px] flex flex-col gap-[24px] lg:mt-[56px] lg:flex-row xl:w-3/4">
            <div className="md:max-w-[430px] lg:w-1/2">
              <Text size="small">
                Keep up to date with our upcoming Public Launch and Exchange
                listing - Subscribe to our newsletter
              </Text>
            </div>
            <SubscribeForm
              className="flex flex-col gap-[16px] md:flex-row"
              inputClassName="md:w-[240px]"
              turnstileSiteKey={turnstileSiteKey}
            />
          </div>
        )}

        {featuredPost && (
          <div className="flex flex-col gap-y-[28px] pt-[60px] md:gap-y-[48px] md:pt-[100px] lg:pt-[140px]">
            <h2 className="text-[22px] font-[600] leading-[24px] md:text-[48px] md:leading-[54px]">
              Featured Post
            </h2>
            <NewsCard post={featuredPost} isFeatured />
          </div>
        )}

        {postsToRender.length > 0 && (
          <PostsBlock
            posts={postsToRender}
            className="mt-[60px] md:mt-[110px] lg:mt-[140px]"
          />
        )}
      </Container>
    </div>
  );
}
