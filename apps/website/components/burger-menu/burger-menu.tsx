import clsx from 'clsx';
import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
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
} from '@haqq/website/ui-kit';
import { SubscribeForm } from '@haqq/website/forms';

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
      <LinkArrowIcon />
    </Link>
  );
}

export function BurgerMenu({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={clsx(
        'bg-haqq-black z-50 px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'border-haqq-border overflow-y-auto sm:border-l',
        // 'backdrop-blur transform-gpu',
        className,
      )}
      onClick={onClick}
    >
      <div className="mb-[60px] flex flex-col items-start space-y-[16px] sm:mb-[80px]">
        <BurgerMenuNavLink href="/#about">About</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/ecosystem-fund">Fund</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/ecosystem">Ecosystem</BurgerMenuNavLink>
        {/* <BurgerMenuNavLink href="/#technology">Technology</BurgerMenuNavLink> */}
        <BurgerMenuNavLink href="/#developers">Developers</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/blog">Blog</BurgerMenuNavLink>
        <BurgerMenuNavLink href="https://docs.haqq.network" isOutLink>
          Docs
        </BurgerMenuNavLink>
        <BurgerMenuNavLink href="/brand-assets">Brand Assets</BurgerMenuNavLink>
        <Link href="/wallet">
          <Button variant={2} className="block sm:hidden">
            HAQQ Wallet
          </Button>
        </Link>
      </div>

      <div className="mb-[60px] grid grid-cols-2 gap-[14px] sm:mb-[80px] sm:gap-[18px]">
        <BurgerMenuSocialLink
          href="https://discord.gg/4quqkD6Y8c"
          icon={
            <DiscordIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
          }
        >
          Discord
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="https://github.com/haqq-network"
          icon={
            <GithubIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
          }
        >
          Github
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="https://twitter.com/The_HaqqNetwork"
          icon={
            <TwitterIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
          }
        >
          Twitter
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="https://t.me/islamiccoin_int"
          icon={
            <TelegramIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
          }
        >
          Telegram
        </BurgerMenuSocialLink>
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

      <div>
        <Heading level={3} className="mb-[16px] sm:mb-[24px]">
          Sign up for HAQQ updates
        </Heading>
        <SubscribeForm
          className="flex flex-col space-y-[40px]"
          inputSize="small"
        />
      </div>
    </div>
  );
}
