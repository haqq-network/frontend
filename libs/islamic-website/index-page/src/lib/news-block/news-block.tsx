import {
  Container,
  Heading,
  NewsCard,
  NewsCardProps,
} from '@haqq/islamic-ui-kit';
import Link from 'next/link';

interface NewsBlockProps {
  news: NewsCardProps[];
}

export function NewsBlock({ news }: NewsBlockProps) {
  return (
    <Container>
      <div className="mt-[110px] flex flex-col items-start md:mt-[160px] lg:mt-[140px] xl:mt-[220px]">
        <Heading className="text-white">Latest Islamic Coin News</Heading>
        <div className="mt-[32px] flex w-full gap-x-[32px] overflow-x-auto md:mt-[52px] md:gap-x-[48px] lg:mt-[72px]">
          {news.slice(0, 3).map((el, idx) => {
            return (
              <Link href={el.source} key={`${el.title}${idx}`}>
                <NewsCard
                  date={el.date}
                  description={el.description}
                  image={el.image}
                  source={el.source}
                  title={el.title}
                />
              </Link>
            );
          })}
        </div>
        <div className="text-islamic-primary-green hover:text-islamic-classic-green mt-[48px] text-center font-mono text-base uppercase transition-colors duration-300">
          <Link href={'/media'} className="flex items-center gap-x-[8px]">
            See all news
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
  );
}
