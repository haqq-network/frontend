import { useTranslations } from 'next-intl';
import { SubscribeForm } from '@haqq/islamic-website/forms';
import { Container, NewsPost, Text } from '@haqq/islamic-website-ui-kit';
import { PostsBlock } from '../posts-block/posts-block';

export function NewsPage({
  news,
  turnstileSiteKey,
}: {
  news?: NewsPost[];
  turnstileSiteKey?: string;
}) {
  const t = useTranslations();

  return (
    <section className="flex flex-col pb-[60px] pt-[32px] text-white md:pb-[100px] md:pt-[52px] lg:pb-[140px] lg:pt-[68px]">
      <Container>
        <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
          {t('news-page.title')}
        </h1>

        {turnstileSiteKey && (
          <div className="mt-[32px] flex flex-col gap-[24px] lg:mt-[56px] lg:flex-row xl:w-3/4">
            <div className="md:max-w-[430px] lg:w-1/2">
              <Text size="small">{t('subscribe-form.text')}</Text>
            </div>
            <SubscribeForm
              className="flex flex-col gap-[16px] md:flex-row"
              inputClassName="md:w-[285px]"
              turnstileSiteKey={turnstileSiteKey}
            />
          </div>
        )}

        {news && news.length > 0 && (
          <PostsBlock
            posts={news}
            className="mt-[60px] md:mt-[110px] lg:mt-[140px]"
          />
        )}
      </Container>
    </section>
  );
}
