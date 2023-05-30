import clsx from 'clsx';
import Markdown from 'marked-react';

interface MarkdownTextProps {
  children: string;
  className?: string;
}

export function MarkdownText({ children, className }: MarkdownTextProps) {
  return (
    <div
      className={clsx(
        'prose prose-base max-w-none',
        'text-white text-[13px] leading-[20px] md:text-[15px] md:leading-[24px] lg:text-[16px] lg:leading-[26px]',
        'prose-a:text-haqq-orange prose-a:no-underline hover:prose-a:text-[#FF8D69]',
        'prose-a:transition-colors prose-a:duration-300 prose-a:ease-out',
        'prose-headings:text-white',
        'prose-strong:text-white',
        'marker:prose-li:text-white',
        'prose-headings:font-serif prose-headings:font-[500] font-sans',
        className,
      )}
    >
      <Markdown gfm>{children}</Markdown>
    </div>
  );
}
