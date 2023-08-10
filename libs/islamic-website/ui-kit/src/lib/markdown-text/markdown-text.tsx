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
        'prose-a:no-underline prose-a:text-islamic-primary-green',
        'prose-a:transition-colors prose-a:duration-300 prose-a:ease-out',
        'prose-headings:font-serif prose-headings:font-[700] font-serif font-[400]',
        'prose-headings:text-white prose-strong:text-white marker:prose-li:text-white text-white',
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
