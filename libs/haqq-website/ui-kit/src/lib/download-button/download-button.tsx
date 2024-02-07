import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '../button/button';

export function DownloadButton({
  onClick,
  className,
  children,
  link,
  withIcon = false,
  variant = 1,
}: PropsWithChildren<{
  link: string;
  className?: string;
  withIcon?: boolean;
  variant?: 1 | 2;
  onClick?: () => void;
}>) {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" download>
      <Button
        className={clsx('inline-flex flex-row items-center', className)}
        variant={variant}
        onClick={onClick}
      >
        {withIcon && (
          <svg
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-[8px]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.59583 5.53574L6.17324 9.11315L6.17324 0.291656H7.83991L7.83991 9.11314L11.4173 5.53574L12.5958 6.71425L7.00658 12.3035L1.41732 6.71425L2.59583 5.53574ZM13.6673 14.05H0.333984V15.7167H13.6673V14.05Z"
              fill="currentColor"
            />
          </svg>
        )}
        <span className="mb-[-2px]">{children}</span>
      </Button>
    </Link>
  );
}
