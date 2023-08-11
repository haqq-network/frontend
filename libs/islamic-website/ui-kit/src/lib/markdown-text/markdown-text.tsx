import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export function MarkdownText({
  children,
  className,
}: {
  className?: string;
  children: string;
}) {
  return (
    <div
      className={clsx(
        'prose prose-base xl:prose-lg max-w-none',
        'prose-a:no-underline prose-a:text-islamic-primary-green hover:prose-a:text-islamic-classic-green-hover',
        'prose-a:transition-colors prose-a:duration-300 prose-a:ease-out',
        'prose-headings:font-serif prose-headings:font-[700] font-serif font-[400]',
        'prose-headings:text-white prose-strong:text-white marker:prose-li:text-white text-white',
        'prose-h2:text-[22px] prose-h2:leading-[24px] lg:prose-h2:text-[48px] lg:prose-h2:leading-[54px]',
        'prose-h3:text-[18px] prose-h3:leading-[26px] lg:prose-h3:text-[24px] lg:prose-h3:leading-[34px]',
        'prose-p:text-[13px] prose-p:leading-[20px] lg:prose-p:text-base',
        'prose-li:text-[13px] prose-li:leading-[20px] lg:prose-li:text-base',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
