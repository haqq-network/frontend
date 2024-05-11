import { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useScrollLock } from 'usehooks-ts';
import { SubscribeForm } from '@haqq/haqq-website/forms';
import {
  DiscordIcon,
  GithubIcon,
  Heading,
  LinkArrowIcon,
  // LinkedinIcon,
  // MediumIcon,
  TelegramIcon,
  TwitterIcon,
  // YoutubeIcon,
  Button,
} from '@haqq/haqq-website-ui-kit';

interface NavLinkProps {
  href: string;
  isOutLink?: boolean;
  onClick?: () => void;
}

type SocialLinkProps = Pick<NavLinkProps, 'href'> & {
  icon: ReactNode;
};

function BurgerMenuNavLink({
  href,
  children,
  isOutLink = false,
  onClick,
}: PropsWithChildren<NavLinkProps>) {
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
      onClick={onClick}
      {...additionalProps}
    >
      {children}
    </Link>
  );
}

function BurgerMenuSocialLink({
  href,
  children,
  icon,
}: PropsWithChildren<SocialLinkProps>) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex flex-initial flex-row items-center space-x-2 text-[12px] leading-[20px] text-white/50 transition-colors duration-100 hover:text-white sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px]"
    >
      <div>{icon}</div>
      <div>{children}</div>
      <LinkArrowIcon className="mb-[-3px]" />
    </Link>
  );
}

export function BurgerMenu({
  className,
  onClose,
  turnstileSiteKey,
}: {
  className?: string;
  onClose?: () => void;
  turnstileSiteKey?: string;
}) {
  useScrollLock();

  return (
    <div
      className={clsx(
        'bg-haqq-black z-50 h-full px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'border-haqq-border overflow-y-auto sm:border-l',
        className,
      )}
    >
      <div className="mb-[60px] flex flex-col items-start space-y-[16px] sm:mb-[80px]">
        <BurgerMenuNavLink onClick={onClose} href="/#about">
          About
        </BurgerMenuNavLink>
        <BurgerMenuNavLink onClick={onClose} href="/ecosystem-fund">
          Fund
        </BurgerMenuNavLink>
        <BurgerMenuNavLink onClick={onClose} href="/ecosystem">
          Ecosystem
        </BurgerMenuNavLink>
        {/* <BurgerMenuNavLink href="/#technology">Technology</BurgerMenuNavLink> */}
        <BurgerMenuNavLink onClick={onClose} href="/#developers">
          Developers
        </BurgerMenuNavLink>
        <BurgerMenuNavLink onClick={onClose} href="/blog">
          Blog
        </BurgerMenuNavLink>
        <BurgerMenuNavLink
          onClick={onClose}
          href="https://docs.haqq.network"
          isOutLink
        >
          Docs
        </BurgerMenuNavLink>
        <BurgerMenuNavLink onClick={onClose} href="/brand-assets">
          Brand Assets
        </BurgerMenuNavLink>
        <BurgerMenuNavLink onClick={onClose} href="/wp">
          Whitepaper
        </BurgerMenuNavLink>
        <BurgerMenuNavLink onClick={onClose} href="/privacy-policy">
          Privacy Policy
        </BurgerMenuNavLink>

        <Link href="https://shell.haqq.network">
          <Button variant={2} className="block md:hidden">
            Shell
          </Button>
        </Link>
        <Link href="/wallet">
          <Button variant={2} className="block md:hidden">
            Wallet
          </Button>
        </Link>
      </div>

      <div className="mb-[60px] grid grid-cols-2 gap-[14px] sm:mb-[80px] sm:gap-[18px]">
        <div>
          <BurgerMenuSocialLink
            href="https://discord.gg/islamiccoin"
            icon={
              <DiscordIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
            }
          >
            Discord
          </BurgerMenuSocialLink>
        </div>
        <div>
          <BurgerMenuSocialLink
            href="https://github.com/haqq-network"
            icon={
              <GithubIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
            }
          >
            Github
          </BurgerMenuSocialLink>
        </div>
        <div>
          <BurgerMenuSocialLink
            href="https://twitter.com/The_HaqqNetwork"
            icon={
              <TwitterIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
            }
          >
            Twitter
          </BurgerMenuSocialLink>
        </div>
        <div>
          <BurgerMenuSocialLink
            href="https://t.me/islamiccoin_int"
            icon={
              <TelegramIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
            }
          >
            Telegram
          </BurgerMenuSocialLink>
        </div>
        {/* <BurgerMenuSocialLink
          href="#YouTube"
          icon={
            <YoutubeIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          YouTube
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="#Medium"
          icon={
            <MediumIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Medium
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="#LinkedIn"
          icon={
            <LinkedinIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          LinkedIn
        </BurgerMenuSocialLink> */}
      </div>

      {turnstileSiteKey && (
        <div>
          <Heading level={3} className="mb-[16px] sm:mb-[24px]">
            Sign up for HAQQ updates
          </Heading>
          <SubscribeForm
            className="flex flex-col space-y-[40px]"
            inputSize="small"
            turnstileSiteKey={turnstileSiteKey}
          />
        </div>
      )}
    </div>
  );
}
