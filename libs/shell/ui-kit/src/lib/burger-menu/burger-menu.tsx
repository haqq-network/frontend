import clsx from 'clsx';
import { ReactNode } from 'react';
import Link from 'next/link';

function BurgerMenuNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
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

export function BurgerMenu({
  className,
  connectButton,
  disconnectButton,
}: {
  className?: string;
  connectButton: ReactNode;
  disconnectButton: ReactNode;
}) {
  return (
    <div className={clsx('bg-black z-50 px-5 py-8 sm:p-10', className)}>
      <div className="flex flex-col items-start">
        <div className="flex flex-col space-y-3 mb-6 sm:mb-20">
          <BurgerMenuNavLink href="/staking">Staking</BurgerMenuNavLink>
          <BurgerMenuNavLink href="/governance">Governance</BurgerMenuNavLink>
        </div>
        <div className="space-y-6">
          {connectButton && <div>{connectButton}</div>}
          {disconnectButton && <div>{disconnectButton}</div>}
        </div>
      </div>
    </div>
  );
}
