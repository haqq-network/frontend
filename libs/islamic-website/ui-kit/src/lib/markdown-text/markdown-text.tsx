import { PropsWithChildren, createElement } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 5.5H6C4.89543 5.5 4 6.39543 4 7.5V11.5C4 12.6046 4.89543 13.5 6 13.5H13C13.7571 13.5 14.4159 13.0793 14.7555 12.459C15.0207 11.9745 15.4477 11.5 16 11.5C16.5523 11.5 17.0128 11.9547 16.8766 12.4899C16.4361 14.2202 14.8675 15.5 13 15.5H6C3.79086 15.5 2 13.7091 2 11.5V7.5C2 5.29086 3.79086 3.5 6 3.5H13C14.8675 3.5 16.4361 4.77976 16.8766 6.51012C17.0128 7.04533 16.5523 7.5 16 7.5C15.4477 7.5 15.0207 7.02548 14.7555 6.54103C14.4159 5.92067 13.7571 5.5 13 5.5ZM18 10.5H11C10.2429 10.5 9.58407 10.9207 9.24447 11.541C8.97928 12.0255 8.55228 12.5 8 12.5C7.44772 12.5 6.98717 12.0453 7.12343 11.5101C7.56394 9.77976 9.13252 8.5 11 8.5H18C20.2091 8.5 22 10.2909 22 12.5V16.5C22 18.7091 20.2091 20.5 18 20.5H11C9.13252 20.5 7.56394 19.2202 7.12343 17.4899C6.98717 16.9547 7.44772 16.5 8 16.5C8.55228 16.5 8.97928 16.9745 9.24447 17.459C9.58406 18.0793 10.2429 18.5 11 18.5H18C19.1046 18.5 20 17.6046 20 16.5V12.5C20 11.3954 19.1046 10.5 18 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
        'prose-p:text-[13px] md:prose-p:text-[14px] prose-p:leading-[20px] lg:prose-p:text-base prose-p:text-white',
        'prose-li:text-[13px] prose-li:leading-[20px] lg:prose-li:text-base',
        'marker:prose-li:font-[600] prose-li:my-0',
        'prose-table:text-[14px] prose-table:leading-[20px] prose-thead:bg-[#2f2f2f]',
        'prose-th:py-[12px] prose-th:text-left rtl:prose-th:text-right prose-th:font-vcr rtl:prose-th:font-handjet prose-th:uppercase',
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
  const renderHeading = ({
    level,
    children,
    node,
  }: PropsWithChildren<{
    level: number;
    node: ReactMarkdownProps['node'];
  }>) => {
    const tagName = `h${level}`;
    const id = node?.properties?.['id'];
    return createElement(
      tagName,
      { ...node?.properties },
      <Link href={`#${id}`} className="group relative !text-white">
        {children}
        <LinkIcon className="ml-[8px] inline transition-opacity duration-150 ease-out lg:opacity-0 lg:group-hover:opacity-100" />
      </Link>,
    );
  };

  return (
    <MarkdownTextProseWrapper className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          h1: renderHeading,
          h2: renderHeading,
          h3: renderHeading,
          h4: renderHeading,
          h5: renderHeading,
          h6: renderHeading,
        }}
      >
        {children}
      </ReactMarkdown>
    </MarkdownTextProseWrapper>
  );
}
