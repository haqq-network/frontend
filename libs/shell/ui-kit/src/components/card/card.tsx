import { PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'cursor-pointer rounded-lg border-[1.5px] border-[#ffffff3d] bg-transparent p-[16px] transition-colors duration-150 ease-out hover:border-[#EC5728] md:min-h-[388px] lg:p-[28px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeading({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'font-guise text-[14px] font-[500] leading-[22px] md:text-[17px] md:leading-[26px] lg:text-[18px] lg:leading-[28px]',
        className,
      )}
    >
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
  return <div className={clsx('font-guise', className)}>{children}</div>;
}

export function CardSubText({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
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
}: PropsWithChildren<{
  color?: 'white' | 'grey';
}>) {
  return (
    <div
      className={clsx(
        'font-clash text-[14px] leading-[18px] lg:text-[20px] lg:leading-[26px]',
        color === 'grey' && 'text-[#8E8E8E]',
        color === 'white' && 'text-white',
      )}
    >
      {children}
    </div>
  );
}
