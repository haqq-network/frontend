import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import styles from './hero-block.module.css';
import { Button, Heading } from '@haqq/website-ui-kit';
import Link from 'next/link';

function DocIcon() {
  return (
    <div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.41667 16.25H14.5833V9.16668H10.1667C9.61438 9.16668 9.16667 8.71896 9.16667 8.16668V3.75001H5.41667V16.25ZM13.893 7.50001L10.8333 4.44037V7.50001H13.893ZM15.4167 17.9167H4.58333C4.1231 17.9167 3.75 17.5436 3.75 17.0833V2.91668C3.75 2.45644 4.1231 2.08334 4.58333 2.08334H10.4882C10.7092 2.08334 10.9211 2.17114 11.0774 2.32742L16.0059 7.25593C16.1622 7.41221 16.25 7.62417 16.25 7.84519V17.0833C16.25 17.5436 15.8769 17.9167 15.4167 17.9167Z"
          fill="#0D0D0E"
        />
      </svg>
    </div>
  );
}

export function PageTitle({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        styles['container'],
        'bg-haqq-black flex flex-col px-[16px] pb-[44px] pt-[50px] sm:px-[63px] sm:pb-[50px] sm:pt-[146px] lg:px-[79px] lg:pb-[80px] lg:pt-[160px]',
        className,
      )}
    >
      <Heading level={2}>{children}</Heading>
      <Link
        href={'/haqq_whitepaper_v_2.pdf'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant={2} className="mt-[16px] flex items-center">
          <DocIcon />
          Whitepaper pdf
        </Button>
      </Link>
    </div>
  );
}
