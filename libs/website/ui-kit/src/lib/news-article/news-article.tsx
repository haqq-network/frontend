import Image from 'next/image';
import { NewsCardProps } from '../news-card/news-card';
import { Heading } from '../heading/heading';
import { MarkdownText } from '../markdown-text/markdown-text';
import { TelegramIcon, TwitterIcon } from '../icons';
import { CopyIcon } from '../icons/copy-icon';

type NewsArticleProps = Omit<NewsCardProps, 'isFeatured' | 'className'> & {
  onLinkCopy?: () => void;
};

export function NewsArticle({
  imageUrl,
  content,
  title,
  date,
  category,
  onLinkCopy,
}: NewsArticleProps) {
  return (
    <section className="flex flex-col items-start px-[16px] py-[48px] md:py-[68px] md:px-[48px] lg:px-[110px] lg:py-[100px] 2xl:px-[320px]">
      <div className="relative w-full h-[193px] md:h-[400px] lg:h-[460px]">
        <Image src={imageUrl} alt="" fill />
      </div>
      <div className="text-white/50 text-[12px] leading-[1.5em] mt-[28px] md:text-[13px] md:leading-[22px] md:mt-[32px] lg:text-[14px] lg:mt-[36px]">
        {new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(date)}
      </div>
      <Heading className="mt-[8px]">{title}</Heading>
      <MarkdownText>{content}</MarkdownText>
      <div className="mt-[20px] md:mt-[24px] lg:mt-[32px] px-[10px] py-[6px] rounded-[2px] border border-haqq-border text-[11px] leading-[1.55em] md:leading-[18px] lg:text-[12px] text-center max-w-fit">
        {category === 'news' && 'News'}
        {category === 'technology' && 'Technology'}
      </div>
      <div className="mt-[20px] md:mt-[24px] lg:mt-[32px] items-center w-full border-y border-[#ffffff26] border-dashed flex gap-x-[26px] py-[17px] px-[10px]">
        <span className="text-white uppercase font-serif text-[14px] tracking-[0.01em] leading-none">
          Share the article
        </span>
        <div className="flex items-center gap-x-[16px] text-white/50">
          {/* <TwitterIcon className="hover:text-white cursor-pointer transition-colors duration-100 ease-out" /> */}
          {/* <TelegramIcon className="hover:text-white cursor-pointer transition-colors duration-100 ease-out" /> */}
          <div>
            <button aria-label="Copy" onClick={onLinkCopy}>
              <CopyIcon className="hover:text-white cursor-pointer transition-colors duration-100 ease-out" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
