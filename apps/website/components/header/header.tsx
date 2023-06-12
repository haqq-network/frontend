import { Fragment, ReactNode, useCallback, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import logoImageData from '../../assets/images/logo.svg';
import { Button, BurgerButton } from '@haqq/website-ui-kit';
import ScrollLock from 'react-scrolllock';
import { BurgerMenu } from '../burger-menu/burger-menu';

function HeaderNavLink({
  href,
  children,
  isOutLink = false,
}: {
  href: string;
  children: ReactNode;
  isOutLink?: boolean;
}) {
  const additionalProps = isOutLink
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  return (
    <Link
      href={href}
      className="text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]"
      {...additionalProps}
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
        'bg-haqq-black h-[63px] w-full border-b border-t border-[#464647] sm:h-[72px]',
        'transform-gpu backdrop-blur',
        'sticky top-0 z-50',
      )}
    >
      <div className="mx-auto flex h-full w-full flex-row items-center pr-[16px] sm:pr-[64px] lg:pr-[80px]">
        <div className="flex h-full w-[48px] items-center justify-center border-r border-[#464647] sm:w-[64px] lg:w-[80px]">
          <div className="relative h-[26px] w-[26px] sm:h-[32px] sm:w-[32px]">
            <Image src={logoImageData} alt="HAQQ" fill />
          </div>
        </div>
        <div className="ml-[12px] font-serif text-[20px] font-medium leading-none sm:ml-[20px] sm:text-[24px] lg:ml-[32px]">
          HAQQ
        </div>
        <div className="flex-1" />
        <nav className="mr-[80px] hidden flex-row items-center space-x-6 lg:flex">
          <HeaderNavLink href="/#about">About</HeaderNavLink>
          <HeaderNavLink href="/ecosystem">Ecosystem</HeaderNavLink>
          <HeaderNavLink href="/ecosystem-fund">Fund</HeaderNavLink>
          {/* <HeaderNavLink href="/#technology">Technology</HeaderNavLink> */}
          <HeaderNavLink href="/#developers">Developers</HeaderNavLink>
          <HeaderNavLink href="/blog">Blog</HeaderNavLink>
          <HeaderNavLink href="https://docs.haqq.network" isOutLink>
            Docs
          </HeaderNavLink>
          {/* <HeaderNavLink href="/#community">Community</HeaderNavLink> */}
          {/* <HeaderNavLink href="/404">404</HeaderNavLink> */}
        </nav>
        <div className="flex flex-row items-center">
          <Link href="/wallet">
            <Button className="hidden sm:block">HAQQ Wallet</Button>
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
          <BurgerMenu
            onClick={handleMenuOpen}
            className="fixed right-0 top-[62px] z-40 h-[calc(100vh-62px)] w-full sm:top-[71px] sm:h-[calc(100vh-71px)] sm:w-[468px] lg:hidden"
          />
          <div
            onClick={handleMenuOpen}
            className="absolute right-0 top-[62px] -z-0 hidden h-[calc(100vh-62px)] w-full bg-black/50 sm:top-[71px] sm:block sm:h-[calc(100vh-71px)] lg:hidden"
          />
        </Fragment>
      )}
    </header>
  );
}
