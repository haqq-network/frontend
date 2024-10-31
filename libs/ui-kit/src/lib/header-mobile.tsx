'use client';
import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollLock } from 'usehooks-ts';
import { useLayout } from '@haqq/shell-shared';
import { BurgerButton } from './burger-button';
import { Container } from './container';
import { HeaderLink, HeaderLinkWithHref } from './header';
import { HeaderNavLink } from './header-nav-link';
import { TestedgeBanner } from './testedge-banner';
import { useScrollTrack } from '../hooks/use-scroll-track';
import { interpolate } from '../utils/interpolate';

export function HeaderMobile({
  web3ButtonsSlot,
  utilsSlot,
  isHaqqWallet = false,
  renderPageTitle,
  isTestedge,
  links,
  className,
}: {
  web3ButtonsSlot?: ReactNode;
  utilsSlot?: ReactNode;
  isHaqqWallet?: boolean;
  isTestedge?: boolean;
  renderPageTitle?: () => ReactNode;
  links: HeaderLink[];
  className?: string;
}) {
  const { lock, unlock } = useScrollLock();
  const [isMobileMenuOpen, setIsMobileMenuOpened] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      lock();
    } else {
      unlock();
    }

    return () => {
      unlock();
    };
  }, [isMobileMenuOpen, lock, unlock]);

  const baseHeaderClassNames = clsx(
    'border-haqq-border w-full transform-gpu border-b-[1px]',
    'transform-gpu overflow-clip transition-[height,background,border] duration-150 ease-in-out will-change-[height,background,border]',
    isMobileMenuOpen ? 'h-[calc(100vh)]' : 'h-[62px]',
    isMobileMenuOpen && '!bg-haqq-black/80 !backdrop-blur',
    className,
  );

  return (
    <Fragment>
      <div className={clsx(isTestedge ? 'h-[calc(62px+64px)]' : 'h-[62px]')} />
      <div className="fixed left-0 top-0 z-50 w-full">
        {isTestedge && <TestedgeBanner />}
        <AnimatedOrNot baseHeaderClassNames={baseHeaderClassNames}>
          <div className="flex h-full flex-col">
            <div className="border-haqq-border mx-auto flex h-[62px] w-full flex-none flex-row items-center border-b-[1px] pr-[16px] sm:pr-[64px]">
              <div
                className={clsx(
                  'flex h-full w-[48px] flex-none items-center justify-center',
                  !isHaqqWallet && 'border-haqq-border border-r',
                )}
              >
                <Link href="/">
                  <div className="relative h-[26px] w-[26px]">
                    <Image src="/logo.svg" alt="HAQQ" fill priority />
                  </div>
                </Link>
              </div>

              <div
                className={clsx(
                  'font-clash text-[24px] font-medium uppercase leading-none',
                  !isHaqqWallet ? 'ml-[20px]' : 'ml-[8px]',
                )}
              >
                {!isHaqqWallet || !renderPageTitle ? (
                  <Link href="/">HAQQ</Link>
                ) : (
                  renderPageTitle()
                )}
              </div>

              <div className="flex-1" />
              <div className="leading-[0]">
                <BurgerButton
                  onClick={() => {
                    setIsMobileMenuOpened(!isMobileMenuOpen);
                  }}
                  isOpen={isMobileMenuOpen}
                  className="mr-[-6px] h-[36px] w-[36px] p-[6px]"
                />
              </div>
            </div>

            <div
              className={clsx(
                'my-[1px] flex-1 overflow-y-auto',
                isMobileMenuOpen ? 'block' : 'hidden',
              )}
            >
              <Container className="flex w-full flex-col gap-[32px] py-[24px]">
                {links.length > 0 && (
                  <nav className="mb-[24px] flex flex-col gap-[24px]">
                    {links.map((link) => {
                      if (link.type === 'dropdown') {
                        return (
                          <HeaderDropdownMobile
                            key={link.label}
                            label={link.label}
                            links={link.children}
                          />
                        );
                      }

                      return (
                        <HeaderNavLink
                          href={link.href}
                          key={link.href}
                          className="inline-flex leading-[24px]"
                          onClick={() => {
                            setIsMobileMenuOpened(false);
                          }}
                        >
                          {link.label}
                        </HeaderNavLink>
                      );
                    })}
                  </nav>
                )}

                {utilsSlot}

                {web3ButtonsSlot}
              </Container>
            </div>
          </div>
        </AnimatedOrNot>
      </div>
    </Fragment>
  );
}

function HeaderDropdownMobile({
  label,
  links,
}: {
  label: string;
  links: HeaderLinkWithHref[];
}) {
  return (
    <div className="header-dropdown">
      <span className="font-bold">{label}</span>
      <div className="flex flex-col gap-[8px]">
        {links.map(({ href, label }) => {
          return (
            <HeaderNavLink href={href} key={href}>
              {label}
            </HeaderNavLink>
          );
        })}
      </div>
    </div>
  );
}

function AnimatedOrNot({
  baseHeaderClassNames,
  children,
}: PropsWithChildren<{ baseHeaderClassNames: string }>) {
  const { isMobileUA } = useLayout();

  return isMobileUA ? (
    <header className={clsx(baseHeaderClassNames, 'backdrop-blur')}>
      {children}
    </header>
  ) : (
    <AnimatedHeader baseHeaderClassNames={baseHeaderClassNames}>
      {children}
    </AnimatedHeader>
  );
}

function AnimatedHeader({
  baseHeaderClassNames,
  children,
}: PropsWithChildren<{ baseHeaderClassNames: string }>) {
  const { top } = useScrollTrack(typeof window !== 'undefined' ? window : null);

  const [springValues, setSpringValues] = useSpring(() => {
    return {
      blur: 0,
      bgOpacity: 0,
      config: { ...config.default },
    };
  });

  useEffect(() => {
    setSpringValues({
      blur: interpolate(top, [0, 80], [0, 8]),
      bgOpacity: interpolate(top, [0, 80], [0, 0.15]),
    });
  }, [setSpringValues, top]);

  return (
    <animated.header
      style={{
        backdropFilter: springValues.blur.to((blur) => {
          return `blur(${blur}px)`;
        }),
        backgroundColor: springValues.bgOpacity.to((opacity) => {
          return `rgba(13, 13, 14, ${opacity})`;
        }),
      }}
      className={baseHeaderClassNames}
    >
      {children}
    </animated.header>
  );
}
