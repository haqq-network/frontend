import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import {
  Container,
  Heading,
  NewsCard,
  NewsPost,
} from '@haqq/islamic-website-ui-kit';

const { Link } = createSharedPathnamesNavigation({
  locales: ['en', 'ar', 'id'],
});

interface NewsBlockProps {
  news?: NewsPost[];
}

export function NewsBlock({ news }: NewsBlockProps) {
  const t = useTranslations('index-page.news-block');

  return (
    <section>
      <Container>
        <div className="mt-[110px] flex flex-col items-start md:mt-[160px] lg:mt-[140px] xl:mt-[220px]">
          <Heading className="text-white">{t('title')}</Heading>
          <div className="mt-[32px] grid grid-cols-1 gap-[32px] md:mt-[52px] md:grid-cols-2 md:gap-[48px] lg:mt-[72px] lg:grid-cols-3">
            {news &&
              news.map((newsItem, idx) => {
                return (
                  <Link
                    href={newsItem.url}
                    key={`${newsItem.title}-${idx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <NewsCard post={newsItem} />
                  </Link>
                );
              })}
          </div>
          <div className="text-islamic-primary-green hover:text-islamic-classic-green rtl:font-handjet ltr:font-vcr mt-[48px] text-center text-base uppercase transition-colors duration-300">
            <Link href="/news" className="flex items-center gap-x-[8px]">
              {t('see-all-news')}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rtl:rotate-180 rtl:transform"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.2558 4.41076C11.9303 4.08533 11.4027 4.08533 11.0772 4.41076C10.7518 4.7362 10.7518 5.26384 11.0772 5.58928L14.6547 9.16669H2.49984C2.0396 9.16669 1.6665 9.53978 1.6665 10C1.6665 10.4603 2.0396 10.8334 2.49984 10.8334H14.6547L11.0772 14.4108C10.7518 14.7362 10.7518 15.2638 11.0772 15.5893C11.4027 15.9147 11.9303 15.9147 12.2558 15.5893L17.2553 10.5898C17.2556 10.5894 17.2559 10.5891 17.2563 10.5888L17.845 10L12.2558 4.41076Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
