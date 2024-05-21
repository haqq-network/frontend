'use client';
import { Fragment, useEffect } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'react-responsive';
import { useScrollLock } from 'usehooks-ts';
import { useWallet, useConfig } from '@haqq/shell-shared';
import { HeaderNavLink, BurgerButton, CommitSha } from '@haqq/shell-ui-kit';

const Web3Buttons = dynamic(async () => {
  const { Web3Buttons } = await import('./web3-buttons');
  return { default: Web3Buttons };
});
const Web3ButtonsMobile = dynamic(async () => {
  const { Web3ButtonsMobile } = await import('./web3-buttons');
  return { default: Web3ButtonsMobile };
});

export function HeaderButtons({
  isMobileMenuOpen,
  onMobileMenuOpenChange,
  isTestedge,
}: {
  isMobileMenuOpen: boolean;
  onMobileMenuOpenChange: (isMobileMenuOpen: boolean) => void;
  isTestedge: boolean;
}) {
  const { commitSha } = useConfig();
  const isDesktop = useMediaQuery({
    query: `(min-width: 1024px)`,
  });
  const { isHaqqWallet } = useWallet();
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    if (isDesktop) {
      onMobileMenuOpenChange(false);
    }
  }, [isDesktop, onMobileMenuOpenChange]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      lock();
    } else {
      unlock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileMenuOpen]);

  return (
    <Fragment>
      <nav className="hidden flex-row items-center space-x-6 lg:flex">
        <HeaderNavLink href="/staking">Staking</HeaderNavLink>
        <HeaderNavLink href="/governance">Governance</HeaderNavLink>
        <HeaderNavLink href="/authz">Authz</HeaderNavLink>
        {isTestedge && <HeaderNavLink href="/faucet">Faucet</HeaderNavLink>}
      </nav>

      <div className="hidden pl-[80px] lg:block">
        <Web3Buttons />
      </div>

      <div className="block leading-[0] lg:hidden">
        <BurgerButton
          isOpen={isMobileMenuOpen}
          onClick={() => {
            onMobileMenuOpenChange(!isMobileMenuOpen);
          }}
          className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
        />
      </div>

      {isMobileMenuOpen && (
        <Fragment>
          <div
            className={clsx(
              'bg-haqq-black fixed right-0 z-40 w-full transform-gpu lg:hidden',
              isTestedge
                ? 'top-[61px] h-[calc(100vh-101px)] sm:top-[71px] sm:h-[calc(100vh-111px)]'
                : 'top-[61px] h-[calc(100vh-61px)] sm:top-[71px] sm:h-[calc(100vh-71px)]',
            )}
          >
            <div className="overflow-y-auto px-[24px] py-[32px]">
              <div className="mb-[24px] flex flex-col items-start gap-[16px] sm:mb-[80px]">
                {isHaqqWallet && (
                  <div>
                    <HeaderNavLink
                      href="/"
                      onClick={() => {
                        onMobileMenuOpenChange(false);
                      }}
                    >
                      Home
                    </HeaderNavLink>
                  </div>
                )}

                <div>
                  <HeaderNavLink
                    href="/staking"
                    onClick={() => {
                      onMobileMenuOpenChange(false);
                    }}
                  >
                    Staking
                  </HeaderNavLink>
                </div>
                <div>
                  <HeaderNavLink
                    href="/governance"
                    onClick={() => {
                      onMobileMenuOpenChange(false);
                    }}
                  >
                    Governance
                  </HeaderNavLink>
                </div>
                <div>
                  <HeaderNavLink
                    href="/authz"
                    onClick={() => {
                      onMobileMenuOpenChange(false);
                    }}
                  >
                    Authz
                  </HeaderNavLink>
                </div>
                {isTestedge && (
                  <div>
                    <HeaderNavLink
                      href="/faucet"
                      onClick={() => {
                        onMobileMenuOpenChange(false);
                      }}
                    >
                      Faucet
                    </HeaderNavLink>
                  </div>
                )}
              </div>

              <Web3ButtonsMobile />
            </div>

            <div className="absolute bottom-[8px] left-[20px]">
              <div className="text-[12px] leading-[16px] text-white/20">
                <CommitSha
                  commitSha={commitSha}
                  className="transition-colors duration-150 hover:text-white/80"
                />
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
