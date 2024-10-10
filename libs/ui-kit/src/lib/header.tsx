'use client';
import { Fragment, ReactNode } from 'react';
import {
  useSpring,
  animated,
  config,
  useIsomorphicLayoutEffect,
} from '@react-spring/web';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderNavLink } from './header-nav-link';
import { TestedgeBanner } from './testedge-banner';
import { useScrollTrack } from '../hooks/use-scroll-track';
import { interpolate } from '../utils/interpolate';

export function Header({
  web3ButtonsSlot,
  utilsSlot,
  isHaqqWallet = false,
  renderPageTitle,
  links,
  className,
  isTestedge,
}: {
  web3ButtonsSlot?: ReactNode;
  utilsSlot?: ReactNode;
  isHaqqWallet?: boolean;
  isTestedge?: boolean;
  renderPageTitle?: () => ReactNode;
  links: { href: string; label: string }[];
  className?: string;
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
          <div className="mx-auto flex h-full w-full flex-row items-center pr-[64px] lg:pr-[24px] xl:pr-[80px]">
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

            <div className="flex-1" />

            {(web3ButtonsSlot || links.length > 0) && (
              <div className="flex flex-row items-center gap-[24px]">
                {links.length > 0 && (
                  <nav className="flex flex-row items-center gap-[24px]">
                    {links.map(({ href, label }) => {
                      return (
                        <HeaderNavLink href={href} key={href}>
                          {label}
                        </HeaderNavLink>
                      );
                    })}
                  </nav>
                )}

                {utilsSlot}

                {web3ButtonsSlot}
              </div>
            )}
          </div>
        </animated.header>
      </div>
    </Fragment>
  );
}
