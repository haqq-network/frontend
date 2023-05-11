import { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'cursor-pointer rounded-lg border-[1.5px] border-[#ffffff3d] bg-transparent p-4 duration-300 hover:border-[#EC5728] lg:p-7',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeading({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[44px] whitespace-pre-wrap font-sans text-[14px] leading-[22px] text-white sm:min-h-[52px] sm:text-[17px] sm:leading-[26px] lg:min-h-[56px] lg:text-[18px] lg:leading-[28px]">
      {children}
    </div>
  );
}

export function CardText({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return <div className={clsx('font-sans', className)}>{children}</div>;
}

export function CardSubText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'text-[11px] leading-[1.5] lg:text-[12px] lg:leading-[17px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TimerText({
  children,
  color = 'grey',
}: {
  children: ReactNode;
  color?: 'white' | 'grey';
}) {
  return (
    <div
      className={clsx(
        'font-serif text-[14px] leading-[18px] lg:text-[20px] lg:leading-[26px]',
        color === 'grey' && 'text-[#8E8E8E]',
        color === 'white' && 'text-white',
      )}
    >
      {children}
    </div>
  );
}

export function ProposalNumber({ children }: { children: ReactNode }) {
  return (
    <div className="text-[14px] leading-[18px] leading-[26px] text-white lg:text-[20px]">
      {children}
    </div>
  );
}
