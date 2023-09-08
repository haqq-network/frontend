import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export function MarkdownText({
  children,
  isBlack = false,
  className,
  transformImageUrl,
}: {
  className?: string;
  isBlack?: boolean;
  children: string;
  transformImageUrl?: (src: string) => string;
}) {
  return (
    <div
      className={clsx(
        'prose prose-base xl:prose-lg max-w-none',
        // 'text-[13px] leading-[20px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]',
        'prose-a:text-haqq-orange prose-a:no-underline hover:prose-a:text-[#FF8D69]',
        'prose-a:transition-colors prose-a:duration-300 prose-a:ease-out',
        'prose-headings:font-serif prose-headings:font-[500] font-sans',
        'prose-img:w-full',
        isBlack
          ? 'text-haqq-black prose-headings:text-haqq-black prose-strong:text-haqq-black marker:prose-li:text-haqq-black'
          : 'prose-headings:text-white prose-strong:text-white marker:prose-li:text-white text-white',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        transformImageUri={transformImageUrl}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
