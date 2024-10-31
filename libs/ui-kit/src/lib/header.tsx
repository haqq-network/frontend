'use client';
import { Fragment, ReactNode, useRef } from 'react';
import {
  useSpring,
  animated,
  config,
  useIsomorphicLayoutEffect,
} from '@react-spring/web';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useHover } from 'usehooks-ts';
import { HeaderNavLink } from './header-nav-link';
import { LocaleDropdown, LocaleOption } from './locale-dropdown';
import { TestedgeBanner } from './testedge-banner';
import { useScrollTrack } from '../hooks/use-scroll-track';
import { interpolate } from '../utils/interpolate';

export interface HeaderLinkWithHref {
  type: 'link';
  href: string;
  label: string;
  chains: number[];
}

export interface HeaderLinkWithChildren {
  type: 'dropdown';
  label: string;
  children: HeaderLinkWithHref[];
}

export type HeaderLink = HeaderLinkWithHref | HeaderLinkWithChildren;

export function Header({
  web3ButtonsSlot,
  isHaqqWallet = false,
  renderPageTitle,
  links,
  className,
  isTestedge,
  switchLocale,
  currentLocale,
  locales,
}: {
  web3ButtonsSlot?: ReactNode;
  isHaqqWallet?: boolean;
  isTestedge?: boolean;
  renderPageTitle?: () => ReactNode;
  links: HeaderLink[];
  className?: string;
  switchLocale?: (locale: string) => void;
  currentLocale?: string;
  locales?: LocaleOption[];
}) {
  const { top } = useScrollTrack(typeof window !== 'undefined' ? window : null);

  const [springValues, setSpringValues] = useSpring(() => {
    return {
      blur: 0,
      bgOpacity: 0,
      config: { ...config.default },
    };
  });

  useIsomorphicLayoutEffect(() => {
    setSpringValues({
      blur: interpolate(top, [30, 120], [0, 8]),
      bgOpacity: interpolate(top, [30, 120], [0, 0.15]),
    });
  }, [setSpringValues, top]);

  return (
    <Fragment>
      <div
        className={clsx(
          'w-full',
          isTestedge ? 'h-[calc(72px+64px)]' : 'h-[72px]',
        )}
      />

      <div className="fixed left-0 top-0 z-50 w-full">
        {isTestedge && <TestedgeBanner />}
        <animated.header
          className={clsx(
            'border-haqq-border h-[72px] w-full transform-gpu border-y',
            className,
          )}
          style={{
            backdropFilter: springValues.blur.to((blur) => {
              return `blur(${blur}px)`;
            }),
            backgroundColor: springValues.bgOpacity.to((opacity) => {
              return `rgba(13, 13, 14, ${opacity})`;
            }),
          }}
        >
          <div className="mx-auto flex h-full w-full flex-row items-center pr-[64px] xl:pr-[80px]">
            <div
              className={clsx(
                'flex h-full w-[64px] flex-none items-center justify-center lg:w-[80px]',
                !isHaqqWallet && 'border-haqq-border border-r',
              )}
            >
              <Link href="/">
                <div className="relative h-[32px] w-[32px]">
                  <Image src="/logo.svg" alt="HAQQ" fill priority />
                </div>
              </Link>
            </div>

            <div
              className={clsx(
                'font-clash text-[24px] font-medium uppercase leading-none',
                !isHaqqWallet
                  ? 'ml-[20px] lg:ml-[32px]'
                  : 'ml-[8px] lg:ml-[4px]',
              )}
            >
              {!isHaqqWallet || !renderPageTitle ? (
                <Link href="/">HAQQ</Link>
              ) : (
                renderPageTitle()
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {(web3ButtonsSlot || links.length > 0) && (
              <div className="flex flex-row items-center gap-[32px] xl:gap-[80px]">
                {links.length > 0 && (
                  <nav className="flex flex-row items-center gap-[24px]">
                    {links.map((link) => {
                      if (link.type === 'dropdown') {
                        return (
                          <HeaderDropdown
                            key={link.label}
                            label={link.label}
                            links={link.children}
                          />
                        );
                      }

                      return (
                        <HeaderNavLink href={link.href} key={link.href}>
                          {link.label}
                        </HeaderNavLink>
                      );
                    })}
                  </nav>
                )}

                {(web3ButtonsSlot || locales?.length) && (
                  <div className="flex flex-row items-center gap-[24px]">
                    {locales?.length && (
                      <LocaleDropdown
                        locales={locales}
                        switchLocale={switchLocale ?? undefined}
                        currentLocale={currentLocale ?? ''}
                      />
                    )}
                    {web3ButtonsSlot}
                  </div>
                )}
              </div>
            )}
          </div>
        </animated.header>
      </div>
    </Fragment>
  );
}

function HeaderDropdown({
  label,
  links,
}: {
  label: string;
  links: HeaderLinkWithHref[];
}) {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <div className="relative" ref={hoverRef}>
      <div className="flex cursor-default flex-row items-center">
        <div className="font-guise text-[13px] leading-[20px] sm:text-[15px] sm:leading-[24px]">
          {label}
        </div>
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          className={clsx(
            'mb-[-2px] ml-[4px] mr-[-6px]',
            'transition-[transform] duration-150 ease-in',
            isHover && 'scale-y-[-1]',
          )}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.85156 8.89817L6.14793 7.60181L10.9997 12.4536L15.8516 7.60181L17.1479 8.89817L10.9997 15.0464L4.85156 8.89817Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div
        className={clsx(
          'absolute left-0 top-full z-50 origin-top',
          'min-w-[150px] pt-[4px]',
          isHover ? 'visible' : 'invisible',
        )}
      >
        <div
          className={clsx(
            'py-[8px]',
            'bg-haqq-black border-haqq-border border text-white',
            'rounded-[8px] shadow-lg focus:outline-none',
          )}
        >
          <div className="flex flex-col gap-[8px]">
            {links.map(({ href, label }) => {
              return (
                <HeaderNavLink
                  href={href}
                  key={href}
                  className={clsx(
                    'block w-full min-w-fit whitespace-nowrap px-[16px] py-[10px] text-left text-[13px] leading-[20px] hover:bg-[#ffffff14]',
                    'transition-colors duration-150 ease-out',
                  )}
                >
                  {label}
                </HeaderNavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
