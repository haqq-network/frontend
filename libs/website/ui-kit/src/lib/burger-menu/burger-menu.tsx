import clsx from 'clsx';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '../button/button';
import {
  DiscordIcon,
  LinkedinIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@haqq/website/ui-kit';
import { SubscribeForm } from '@haqq/website/forms';

function BurgerMenuNavLink({
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

function FooterNavSocialLinkArrow() {
  return (
    <svg
      className="hidden sm:block sm:invisible group-hover:visible h-[24px] w-[24px]"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9028 8.5H7.71344V7H17.4634V16.75H15.9634V9.56066L8.24377 17.2803L7.18311 16.2197L14.9028 8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FooterNavSocialLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[12px] leading-[20px] sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px] text-white/50 hover:text-white transition-colors duration-100 group inline-flex flex-row flex-initial space-x-2 items-center"
    >
      <div>{icon}</div>
      <div>{children}</div>
      <FooterNavSocialLinkArrow />
    </Link>
  );
}

export function BurgerMenu({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-haqq-black z-50 px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'sm:border-l border-haqq-border',
        // 'backdrop-blur transform-gpu',
        className,
      )}
    >
      <div className="flex flex-col items-start space-y-[16px] mb-[60px] sm:mb-[80px]">
        <BurgerMenuNavLink href="/#about">About</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/#technology">Technology</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/#developers">Developers</BurgerMenuNavLink>
        <BurgerMenuNavLink href="/#community">Community</BurgerMenuNavLink>
        <Button className="block sm:hidden">Haqq wallet</Button>
      </div>
      <div className="grid grid-cols-2 gap-[14px] sm:gap-[18px] mb-[60px] sm:mb-[80px]">
        <FooterNavSocialLink
          href="#Discord"
          icon={
            <DiscordIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Discord
        </FooterNavSocialLink>
        <FooterNavSocialLink
          href="#Twitter"
          icon={
            <TwitterIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Twitter
        </FooterNavSocialLink>
        <FooterNavSocialLink
          href="#Telegram"
          icon={
            <TelegramIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Telegram
        </FooterNavSocialLink>
        <FooterNavSocialLink
          href="#YouTube"
          icon={
            <YoutubeIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          YouTube
        </FooterNavSocialLink>
        <FooterNavSocialLink
          href="#Medium"
          icon={
            <MediumIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Medium
        </FooterNavSocialLink>
        <FooterNavSocialLink
          href="#LinkedIn"
          icon={
            <LinkedinIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          LinkedIn
        </FooterNavSocialLink>
      </div>
      <SubscribeForm />
    </div>
  );
}
