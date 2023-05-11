import { ReactNode } from 'react';
import clsx from 'clsx';

export interface NewCardProps {
  children: ReactNode;
  className?: string;
}

export function NewCard({ children, className }: NewCardProps) {
  return (
    <div className="rounded-lg border border-[#ffffff3d] bg-transparent p-4 duration-300 hover:cursor-pointer hover:border-[#EC5728] lg:p-7">
      {children}
    </div>
  );
}

export function NewCardHeading({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[44px] whitespace-pre-wrap font-sans text-[14px] leading-[22px] text-white sm:min-h-[52px] sm:text-[17px] sm:leading-[26px] lg:min-h-[56px] lg:text-[18px] lg:leading-[28px]">
      {children}
    </div>
  );
}

export function NewCardText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx('font-sans', className)}>{children}</div>;
}

export function NewCardSubText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'text-[11px] leading-[18px] lg:text-[12px] lg:leading-[17px]',
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
    <div className="text-[14px] leading-[18px] text-white lg:text-[20px] lg:leading-[26px]">
      {children}
    </div>
  );
}
