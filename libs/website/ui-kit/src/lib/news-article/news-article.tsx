import Image from 'next/image';
// import { NewsCardProps } from '../news-card/news-card';
import { Heading } from '../heading/heading';
import { MarkdownText } from '../markdown-text/markdown-text';
// import { TelegramIcon, TwitterIcon } from '../icons';
import { CopyIcon } from '../icons/copy-icon';

export function NewsArticle({
  image,
  content,
  title,
  date,
  tags,
  onLinkCopy,
}: {
  image: {
    src: string;
    width: number;
    height: number;
  };
  title: string;
  content: string;
  date: string;
  tags: string[];
  className?: string;
  onLinkCopy?: () => void;
}) {
  console.log({ image, content, title, date, tags });
  return (
    <section className="flex flex-col items-start py-[48px] md:py-[68px] lg:py-[100px]">
      <div className="px-[16px] sm:px-[63px] lg:px-[79px] overflow-clip w-full">
        <div className="max-w-4xl mx-auto">
          <article>
            <div className="relative w-full h-[193px] md:h-[400px] lg:h-[460px] mb-[28px] md:mb-[32px] lg:mb-[36px]">
              <Image src={image.src} alt="" fill role="img" />
            </div>

            <div className="text-white/50 text-[12px] leading-[1.5em] md:text-[13px] md:leading-[22px] lg:text-[14px] mb-[8px]">
              {new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(new Date(date))}
            </div>

            <Heading className="mb-[24px]">{title}</Heading>

            <MarkdownText>{content}</MarkdownText>
          </article>

          <div className="flex flex-row flex-wrap gap-[6px] mt-[20px] md:mt-[24px] lg:mt-[32px]">
            {tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className="px-[10px] py-[6px] rounded-[2px] border border-haqq-border text-[11px] leading-[1.55em] md:leading-[18px] lg:text-[12px] text-center max-w-fit"
                >
                  {tag}
                </div>
              );
            })}
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
        </div>
      </div>
    </section>
  );
}
