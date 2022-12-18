import { Fragment, ReactNode, useCallback, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import logoImageData from '../../assets/images/logo.svg';
import { Button, BurgerButton } from '@haqq/website/ui-kit';
import ScrollLock from 'react-scrolllock';
import { BurgerMenu } from '../burger-menu/burger-menu';

function HeaderNavLink({
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

export function Header() {
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setBurgerMenuOpen((isBurgerMenuOpen: boolean) => {
      return !isBurgerMenuOpen;
    });
  }, []);

  return (
    <header
      className={clsx(
        'border-t border-b border-[#464647] w-full h-[63px] sm:h-[72px] bg-haqq-black',
        'backdrop-blur transform-gpu',
        'top-0 sticky z-50',
      )}
    >
      <div className="w-full flex flex-row items-center h-full pr-[16px] sm:pr-[64px] lg:pr-[80px] mx-auto">
        <div className="w-[48px] sm:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-[#464647]">
          <div className="relative w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]">
            <Image src={logoImageData.src} alt="HAQQ" fill />
          </div>
        </div>
        <div className="ml-[12px] sm:ml-[20px] lg:ml-[32px] font-serif font-medium text-[20px] sm:text-[24px] leading-none">
          HAQQ
        </div>
        <div className="flex-1" />
        <nav className="flex-row space-x-6 items-center mr-[80px] hidden lg:flex">
          <HeaderNavLink href="/#about">About</HeaderNavLink>
          <HeaderNavLink href="/#technology">Technology</HeaderNavLink>
          <HeaderNavLink href="/#developers">Developers</HeaderNavLink>
          <HeaderNavLink href="/#community">Community</HeaderNavLink>
          {/* <HeaderNavLink href="/404">404</HeaderNavLink> */}
        </nav>
        <div className="flex flex-row items-center">
          <Link href="/wallet">
            <Button className="hidden sm:block">Haqq wallet</Button>
          </Link>
          <BurgerButton
            className="ml-[24px] block lg:hidden"
            isOpen={isBurgerMenuOpen}
            onClick={handleMenuOpen}
          />
        </div>
      </div>

      {isBurgerMenuOpen && (
        <Fragment>
          <ScrollLock isActive />
          <BurgerMenu className="fixed lg:hidden w-full sm:w-[468px] top-[62px] sm:top-[71px] h-[calc(100vh-62px)] sm:h-[calc(100vh-71px)] right-0 z-40" />
          <div
            onClick={handleMenuOpen}
            className="hidden sm:block lg:hidden absolute w-full right-0 -z-0 bg-black/50 top-[62px] sm:top-[71px] h-[calc(100vh-62px)] sm:h-[calc(100vh-71px)]"
          />
        </Fragment>
      )}
    </header>
  );
}
