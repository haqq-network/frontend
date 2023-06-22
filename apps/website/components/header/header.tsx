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
    setBurgerMenuOpen(!isBurgerMenuOpen);
  }, [isBurgerMenuOpen]);

  const handleMenuClose = useCallback(() => {
    setBurgerMenuOpen(false);
  }, []);

  return (
    <Fragment>
      <header
        className={clsx(
          'bg-haqq-black h-[63px] w-full border-b border-t border-[#464647] sm:h-[72px]',
          'sticky top-0 z-50',
        )}
      >
        <div className="relative z-50 mx-auto flex h-full w-full flex-row items-center pr-[16px] sm:pr-[64px] lg:pr-[80px]">
          <div className="flex h-full w-[48px] items-center justify-center border-r border-[#464647] sm:w-[64px] lg:w-[80px]">
            <div className="relative h-[26px] w-[26px] sm:h-[32px] sm:w-[32px]">
              <Image src={logoImageData} alt="HAQQ" fill />
            </div>
          </div>
          <div className="ml-[12px] font-serif text-[20px] font-medium leading-none sm:ml-[20px] sm:text-[24px] lg:ml-[32px]">
            HAQQ
          </div>
          <div className="flex-1" />
          <nav className="hidden flex-row items-center space-x-[24px] pl-[24px] lg:mr-[40px] lg:flex xl:mr-[60px]">
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
          <div className="flex flex-row items-center gap-[16px]">
            <Link href="https://app.haqq.network">
              <Button className="hidden sm:block">Shell</Button>
            </Link>
            <Link href="/wallet">
              <Button className="hidden sm:block">Wallet</Button>
            </Link>
            <div className="block pl-[8px] leading-[0] lg:hidden">
              <BurgerButton
                isOpen={isBurgerMenuOpen}
                onClick={handleMenuOpen}
                className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
              />
            </div>
          </div>
        </div>
      </header>
      <BurgerMenuComponent
        isOpen={isBurgerMenuOpen}
        onClose={handleMenuClose}
      />
    </Fragment>
  );
}

function BurgerMenuComponent({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className="lg:hidden">
      <ScrollLock isActive={isOpen} />

      <div
        className={clsx(
          'fixed right-0 top-[62px] z-[45] h-[calc(100vh-62px)] w-full sm:top-[72px] sm:h-[calc(100vh-72px)] sm:w-[468px]',
          'transform-gpu transition-transform duration-150 will-change-transform',
          isOpen ? 'translate-x-[0px] ease-in' : 'translate-x-[468px] ease-out',
        )}
      >
        <BurgerMenu onClose={onClose} />
      </div>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed right-0 top-[0] z-40 h-full w-full bg-black/80"
        />
      )}
    </div>
  );
}
