import Image, { StaticImageData } from 'next/image';
import { CopyIcon } from '../icons';
import { MarkdownText } from '../markdown-text/markdown-text';
import { Tooltip } from '../tooltip/tooltip';

export function BlogArticle({
  content,
  title,
  publishDate,
  tags,
  onLinkCopy,
  isLinkCopied,
  image,
}: {
  title: string;
  content: string;
  publishDate: string;
  tags: string[];
  className?: string;
  onLinkCopy?: () => void;
  isLinkCopied?: boolean;
  image: StaticImageData | null;
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
          <time
            className="font-vcr text-[13px] uppercase leading-[20px] lg:text-[14px]"
            dateTime={postDate.toISOString()}
          >
            {formattedPostDate}
          </time>
        </div>

        <MarkdownText className="anchor-fix prose-headings:font-vcr rtl:prose-headings:font-handjet prose-headings:uppercase">
          {'# ' + title + '\n\n' + content}
        </MarkdownText>
      </article>

      <div className="mt-[20px] flex flex-row flex-wrap gap-[6px] md:mt-[24px] lg:mt-[32px]">
        {tags.map((tag) => {
          return (
            <div
              key={tag}
              className="font-vcr rtl:font-handjet max-w-fit rounded-[8px] border border-[#585858] px-[10px] py-[6px] text-center text-[12px] uppercase leading-[1.5em]"
            >
              {tag}
            </div>
          );
        })}
      </div>

      <div className="mt-[20px] md:mt-[24px] lg:mt-[32px]">
        <div className="flex w-fit flex-row items-center gap-x-[26px] rounded-[8px] border border-[#585858] px-[24px] py-[14px]">
          <span className="font-vcr text-[14px] uppercase leading-none tracking-[0.01em] text-white">
            Share the article
          </span>
          <div className="flex items-center gap-x-[16px] text-white/50">
            <div className="leading-[0]">
              <button aria-label="Copy link" onClick={onLinkCopy}>
                <Tooltip text={!isLinkCopied ? 'Copy link' : 'Link copied'}>
                  <CopyIcon className="cursor-pointer transition-colors duration-100 ease-out hover:text-white" />
                </Tooltip>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
