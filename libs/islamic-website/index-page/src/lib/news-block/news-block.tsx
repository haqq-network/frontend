import { Heading, NewsCard, NewsCardProps, Text } from '@haqq/islamic-ui-kit';
import Link from 'next/link';

interface NewsBlockProps {
  news: NewsCardProps[];
}

export function NewsBlock({ news }: NewsBlockProps) {
  return (
    <div className="flex flex-col items-start">
      <Heading className="text-white">Latest Islamic Coin News</Heading>

      <div className="mt-[72px] flex gap-x-[48px]">
        {news.slice(0, 2).map((el) => {
          return (
            <Link href={el.source} key={el.title}>
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
      <div className="text-islamic-primary-green mt-[48px] text-center">
        <Link href={'/media'} className="flex items-center gap-x-[8px]">
          <Text isMono>See all news</Text>
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
  );
}
