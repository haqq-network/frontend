import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export function MarkdownTextProseWrapper({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'prose prose-base xl:prose-lg max-w-full',
        'prose-a:no-underline prose-a:text-islamic-primary-green hover:prose-a:text-islamic-classic-green-hover',
        'prose-a:transition-colors prose-a:duration-300 prose-a:ease-out',
        'prose-headings:font-alexandria prose-headings:font-[700] font-alexandria font-[400]',
        'prose-headings:text-white prose-strong:text-white marker:prose-li:text-white text-white',
        'prose-h2:text-[22px] prose-h2:leading-[24px] lg:prose-h2:text-[48px] lg:prose-h2:leading-[54px]',
        'prose-h2:mb-[20px] prose-h2:mt-[32px] md:prose-h2:mb-[28px] md:prose-h2:mt-[56px] lg:prose-h2:mb-[32px] lg:prose-h2:mt-[64px]',
        'prose-h3:text-[18px] prose-h3:leading-[26px] lg:prose-h3:text-[24px] lg:prose-h3:leading-[34px]',
        'prose-h3:my-[16px] md:prose-h3:my-[20px] lg:prose-h3:my-[24px]',
        'prose-p:text-[13px] md:prose-p:text-[14px] prose-p:leading-[20px] lg:prose-p:text-base',
        'prose-li:text-[13px] prose-li:leading-[20px] lg:prose-li:text-base',
        'marker:prose-li:font-[600] prose-li:my-0',
        'prose-table:text-[14px] prose-table:leading-[20px] prose-thead:bg-[#2f2f2f]',
        'prose-th:py-[12px] prose-th:text-left rtl:prose-th:text-right ltr:prose-th:font-vcr rtl:prose-th:font-handjet prose-th:uppercase',
        'first:prose-th:pl-[16px] first:prose-th:pr-0 rtl:first:prose-th:pl-0 rtl:first:prose-th:pr-[16px] even:prose-th:px-[24px] last:prose-th:pr-[16px] last:prose-th:pl-0 rtl:last:prose-th:pl-[16px] rtl:last:prose-th:pr-0',
        'first:prose-td:pl-[16px] first:prose-td:pr-0 rtl:first:prose-td:pl-0 rtl:first:prose-td:pr-[16px] even:prose-td:px-[24px] last:prose-td:pr-[16px] last:prose-td:pl-0 rtl:last:prose-td:pl-[16px] rtl:last:prose-td:pr-0',
        'prose-tr:border-none prose-thead:border-none even:prose-tr:bg-[#2f2f2f]',
        'rtl:prose-ul:pr-[26px] rtl:prose-ul:pl-0 rtl:prose-ol:pr-[26px] rtl:prose-ol:pl-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MarkdownText({
  children,
  className,
}: {
  className?: string;
  children: string;
}) {
  return (
    <MarkdownTextProseWrapper className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
      >
        {children}
      </ReactMarkdown>
    </MarkdownTextProseWrapper>
  );
}
