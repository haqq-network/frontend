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
}: {
  title: string;
  content: string;
  publishDate: string;
  tags: string[];
  className?: string;
  onLinkCopy?: () => void;
  isLinkCopied?: boolean;
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
    <section className="flex flex-col items-start py-[32px] md:py-[60px] lg:py-[80px]">
      <div className="w-full overflow-clip px-[16px] sm:px-[40px] lg:px-[80px]">
        <div className="mx-auto max-w-4xl xl:max-w-5xl">
          <article>
            <div className="mb-[8px] text-[12px] leading-[1.5em] text-white/50 md:text-[13px] md:leading-[22px] lg:text-[14px]">
              <time
                className="font-vcr text-[13px] leading-[20px] lg:text-[14px]"
                dateTime={postDate.toISOString()}
              >
                {formattedPostDate}
              </time>
            </div>

            <MarkdownText>{'# ' + title + '\n\n' + content}</MarkdownText>
          </article>

          <div className="mt-[20px] flex flex-row flex-wrap gap-[6px] md:mt-[24px] lg:mt-[32px]">
            {tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className="ltr:font-vcr rtl:font-handjet max-w-fit rounded-[8px] border border-[#585858] px-[10px] py-[6px] text-center text-[12px] leading-[1.5em]"
                >
                  {tag}
                </div>
              );
            })}
          </div>

          <div className="mt-[20px] md:mt-[24px] lg:mt-[32px]">
            <div className="flex w-fit flex-row items-center gap-x-[26px] rounded-[8px] border border-[#585858] px-[24px] py-[14px] ">
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
      </div>
    </section>
  );
}
