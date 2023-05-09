import { Heading, Text } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import Link from 'next/link';

function DevelopersBlockCard({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  const classNames = clsx(
    'rounded-[6px] border border-haqq-border hover:border-haqq-orange',
    'p-[16px] lg:p-[24px] flex flex-col space-y-[32px] lg:justify-between lg:h-[228px]',
    'cursor-pointer group',
    'transition-color duration-150 ease-in',
    className,
  );
  return (
    <div className={classNames}>
      <div className="flex flex-row justify-between items-center">
        <div>
          <Heading level={2} className="lg:text-[24px] lg:leading-none">
            {title}
          </Heading>
        </div>
        <svg
          className="h-[12px] w-[12px] sm:h-[20px] sm:w-[20px] text-haqq-border group-hover:text-haqq-orange transition-color duration-150 ease-in"
          viewBox="0 0 22 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 21.5L21 1.5M21 1.5V21.5M21 1.5H1"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="sm:max-w-[65%]">
        <Text size="medium">{description}</Text>
      </div>
    </div>
  );
}

export function DevelopersBlock() {
  return (
    <div
      className="px-[16px] ml-[16px] sm:pl-[20px] sm:pr-[64px] sm:ml-[63px] lg:ml-[79px] lg:pl-[32px] lg:pr-[80px] border-l border-haqq-border"
      id="developers"
    >
      <div className="py-[60px] sm:py-[100px] flex flex-col space-y-[32px] lg:space-y-0 lg:flex-row">
        <div className="flex flex-col space-y-[16px] lg:flex-1 lg:w-[595px] pr-[32px]">
          <Heading>Become a builder</Heading>
          <div className="hidden lg:block flex-1" />
          <Text className="text-white/80 sm:max-w-[450px]">
            Work and build on HAQQ, and be part of tomorrow’s future - today.
            Bring your vision to life and develop solutions that benefit users
            and the world as a whole. Support the network and HAQQ’s
            ethics-first and Shariah-compliant innovation.
          </Text>
        </div>
        <div className="flex flex-col space-y-[16px] flex-1 lg:space-y-[32px]">
          <Link
            href="https://docs.haqq.network/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DevelopersBlockCard
              title="Become a Developer"
              description="Build standalone Shariah-compliant applications, create your own DeFI or issue NFTs, on a foundation of fair and sustainable principles"
            />
          </Link>
          <Link
            href="https://docs.haqq.network/guides/validators/setup.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DevelopersBlockCard
              title="Become a Validator"
              description="Help to secure the network and earn rewards by running a validator"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
