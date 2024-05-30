import clsx from 'clsx';
import Link from 'next/link';
import { Heading, Text } from '@haqq/haqq-website-ui-kit';

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
    'p-[16px] lg:p-[24px] flex flex-col space-y-[32px] lg:justify-between xl:h-[228px]',
    'cursor-pointer group',
    'transition-color duration-150 ease-in',
    className,
  );

  return (
    <div className={classNames}>
      <div className="flex flex-row items-center justify-between">
        <div>
          <Heading level={2} className="lg:text-[24px] lg:leading-none">
            {title}
          </Heading>
        </div>
        <svg
          className="text-haqq-border group-hover:text-haqq-orange transition-color h-[12px] w-[12px] duration-150 ease-in sm:h-[20px] sm:w-[20px]"
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
      className="border-haqq-border ml-[16px] border-l px-[16px] sm:ml-[63px] sm:pl-[20px] sm:pr-[64px] lg:ml-[79px] lg:pl-[32px] lg:pr-[80px]"
      id="developers"
    >
      <div className="flex flex-col space-y-[32px] py-[60px] sm:py-[100px] lg:flex-row lg:space-y-0">
        <div className="flex flex-col space-y-[16px] pr-[32px] lg:w-[595px] lg:flex-1">
          <Heading>Become a builder</Heading>
          <div className="hidden flex-1 lg:block" />
          <Text className="text-white/80 sm:max-w-[450px]">
            Work and build on HAQQ, and be part of tomorrow’s future - today.
            Bring your vision to life and develop solutions that benefit users
            and the world as a whole. Support the network and HAQQ’s
            ethics-first and Shariah-compliant innovation.
          </Text>
        </div>
        <div className="flex flex-1 flex-col space-y-[16px] lg:space-y-[32px]">
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
            href="https://docs.haqq.network/network/run-a-validator/"
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
