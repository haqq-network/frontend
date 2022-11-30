import { ReactNode } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import { Button } from '../button/button';
import { BurgerButton } from '../burger-button/burger-button';

function HeaderNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-[16px] leading-[26px]">
      {children}
    </Link>
  );
}

export function Header() {
  return (
    <header
      className={clsx(
        'border-t border-b border-haqq-border top-0 sticky h-[63px] md:h-[72px] bg-haqq-black z-50',
      )}
    >
      <div className="lg:container w-full flex flex-row items-center h-full pr-[12px] md:pr-[64px] lg:pr-[58px] mx-auto">
        <div className="w-[48px] md:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-haqq-border">
          <div className="relative w-[26px] h-[26px] md:w-[32px] md:h-[32px]">
            <Image src="/logo.svg" alt="HAQQ" fill />
          </div>
        </div>
        <div className="ml-[12px] md:ml-[20px] lg:ml-[32px] font-serif font-medium text-[20px] md:text-[24px] leading-none">
          HAQQ
        </div>
        <div className="flex-1" />
        <nav className="flex-row space-x-6 items-center mr-[80px] hidden lg:flex">
          <HeaderNavLink href="/#about">About</HeaderNavLink>
          <HeaderNavLink href="/#technology">Technology</HeaderNavLink>
          <HeaderNavLink href="/#developers">Developers</HeaderNavLink>
          <HeaderNavLink href="/#community">Community</HeaderNavLink>
          <HeaderNavLink href="/404">404</HeaderNavLink>
        </nav>
        <div className="flex flex-row items-center">
          <Button className="hidden md:block">Haqq wallet</Button>
          <BurgerButton className="ml-[24px] block lg:hidden" />
        </div>
      </div>
    </header>
  );
}
