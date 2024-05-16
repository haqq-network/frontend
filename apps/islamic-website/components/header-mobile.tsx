'use client';
import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { useScrollLock } from 'usehooks-ts';
import { LocaleType } from '@haqq/islamic-website/shariah-page';
import {
  Container,
  BurgerButton,
  Button,
  IslamicHeaderLogo,
} from '@haqq/islamic-website-ui-kit';
import { BurgerMenu } from './burger-menu/burger-menu';

const { Link } = createSharedPathnamesNavigation({
  locales: [
    'en',
    // 'ar', 'id'
  ],
});

export function MobileHeader({
  isBannerVisible = false,
  locale,
  className,
  isBuyButtonVisible = false,
}: {
  isBannerVisible?: boolean;
  locale: LocaleType;
  className?: string;
  isBuyButtonVisible?: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpened] = useState(false);
  const [isBlurred, setBlurred] = useState(false);
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    const offset = 40;

    function handleScroll() {
      if (window.scrollY > offset) {
        setBlurred(true);
      } else {
        setBlurred(false);
      }
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  return (
    <Fragment>
      <div
        className={clsx(
          isBannerVisible
            ? 'h-[calc(72px+64px)] md:h-[calc(72px+40px)]'
            : 'h-[72px]',
          className,
        )}
      />
      <header
        className={clsx(
          'fixed z-50 h-[72px] w-full border-b-[1px] border-transparent',
          isBannerVisible
            ? 'top-[88px] min-[370px]:top-[64px] md:top-[40px]'
            : 'top-[0px]',
          'transform-gpu overflow-clip transition-[height,background,border] duration-150 ease-in-out will-change-[height,background,border]',
          isMobileMenuOpen
            ? 'bg-[#15191ef2] backdrop-blur-[6px]'
            : isBlurred
              ? '!border-[#2F2F2F] bg-[#010304CC] backdrop-blur-[6px]'
              : 'bg-transparent',
          isMobileMenuOpen &&
            isBannerVisible &&
            'h-[calc(100vh-64px)] md:h-[calc(100vh-40px)]',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="py-[18px]">
            <Container>
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href="/"
                    aria-label="Islamic Coin"
                    className="hover:text-islamic-primary-green leading-[0] text-white transition-colors duration-150"
                  >
                    <IslamicHeaderLogo />
                  </Link>
                </div>
                <div className="leading-[0]">
                  <div className="flex flex-row items-center gap-[12px]">
                    {isBuyButtonVisible && (
                      <Link
                        href="/markets"
                        className="leading-[0]"
                        data-attr="buy-islm"
                      >
                        <Button className="!h-[36px] !px-[16px] !py-[4px] !text-[14px] !leading-[28px]">
                          Buy ISLM
                        </Button>
                      </Link>
                    )}
                    <div className="leading-[0]">
                      <BurgerButton
                        onClick={() => {
                          setIsMobileMenuOpened(!isMobileMenuOpen);
                        }}
                        isOpen={isMobileMenuOpen}
                        className="p-[6px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <div
            className={clsx(
              'my-[1px] flex-1 overflow-y-auto',
              isMobileMenuOpen ? 'block' : 'hidden',
            )}
          >
            <div className={clsx('py-[24px]', 'w-full')}>
              <BurgerMenu
                locale={locale}
                isOpen={isMobileMenuOpen}
                onClick={() => {
                  setIsMobileMenuOpened(false);
                }}
              />
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
}
