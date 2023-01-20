import clsx from 'clsx';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@haqq/website/ui-kit';

function BurgerMenuNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
  isOutLink?: boolean;
}) {
  return (
    <Link
      href={href}
      className="text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
    >
      {children}
    </Link>
  );
}

export function BurgerMenu({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-black z-50 px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'sm:border-l border-haqq-border overflow-y-auto',
        className,
      )}
    >
      <div className="flex flex-col items-start space-y-[16px] mb-[60px] sm:mb-[80px]">
        <BurgerMenuNavLink href="/staking">Staking</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/governance">Governance</BurgerMenuNavLink>
      </div>
    </div>
  );
}
