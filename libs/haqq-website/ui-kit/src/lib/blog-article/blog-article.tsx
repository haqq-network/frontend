import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
// import { Heading } from '../heading/heading';
import { TwitterIcon } from '../icons';
import { CopyIcon } from '../icons/copy-icon';
import { MarkdownText } from '../markdown-text/markdown-text';
// import { TelegramIcon, TwitterIcon } from '../icons';
import { Tooltip } from '../tooltip/tooltip';

export function BlogArticle({
  image,
  content,
  title,
  publishDate,
  tags,
  onLinkCopy,
  transformImageUrl,
  articleLink,
  utmCampaign,
}: {
  image: StaticImageData | null;
  title: string;
  content: string;
  publishDate: string;
  tags: string[];
  className?: string;
  onLinkCopy?: () => void;
  transformImageUrl?: (src: string) => string;
  articleLink: string;
  utmCampaign?: string;
}) {
  const postDate = new Date(publishDate);
  const formattedPostDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(postDate);

  return (
    <section className="flex flex-col items-start py-[48px] md:py-[68px] lg:py-[100px]">
      <div className="w-full overflow-clip px-[16px] sm:px-[63px] lg:px-[79px]">
        <div className="mx-auto max-w-4xl xl:max-w-5xl">
          <article>
            {image && (
              <div className="relative mb-[28px] w-full md:mb-[32px] lg:mb-[36px]">
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={title}
                  role="img"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mb-[8px] text-[12px] leading-[1.5em] text-white/50 md:text-[13px] md:leading-[22px] lg:text-[14px]">
              <time dateTime={postDate.toISOString()}>{formattedPostDate}</time>
            </div>

            <MarkdownText
              transformImageUrl={transformImageUrl}
              shouldRenderHeadingLinks={true}
              className="anchor-fix-blog"
              utmCampaign={utmCampaign}
            >
              {'# ' + title + '\n\n' + content}
            </MarkdownText>
          </article>

          <div className="mt-[20px] flex flex-row flex-wrap gap-[6px] md:mt-[24px] lg:mt-[32px]">
            {tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className="border-haqq-border max-w-fit rounded-[2px] border px-[10px] py-[6px] text-center text-[11px] leading-[1.55em] md:leading-[18px] lg:text-[12px]"
                >
                  {tag}
                </div>
              );
            })}
          </div>

          <div className="mt-[20px] md:mt-[24px] lg:mt-[32px]">
            <div className="flex w-full flex-row items-center gap-x-[26px] border-y border-dashed border-[#ffffff26] px-[10px] py-[17px]">
              <span className="font-clash text-[14px] uppercase leading-none tracking-[0.01em] text-white">
                Share the article
              </span>
              <div className="flex items-center gap-x-[16px] text-white/50">
                <Link
                  aria-label="Share to twitter"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(articleLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon className="cursor-pointer transition-colors duration-100 ease-out hover:text-white" />
                </Link>
                {/* <TelegramIcon className="hover:text-white cursor-pointer transition-colors duration-100 ease-out" /> */}
                <div className="leading-[0]">
                  <button aria-label="Copy link" onClick={onLinkCopy}>
                    <Tooltip text="Copy link">
                      <CopyIcon className="cursor-pointer transition-colors duration-100 ease-out hover:text-white" />
                    </Tooltip>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
