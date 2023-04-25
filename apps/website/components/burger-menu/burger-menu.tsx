import clsx from 'clsx';
import { ReactNode } from 'react';
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
import { SubscribeForm } from '@haqq/website/shared';

function BurgerMenuNavLink({
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

function BurgerMenuSocialLink({
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
      target="_blank"
      rel="noopener noreferrer"
      className="text-[12px] leading-[20px] sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px] text-white/50 hover:text-white transition-colors duration-100 group inline-flex flex-row flex-initial space-x-2 items-center"
    >
      <div>{icon}</div>
      <div>{children}</div>
      <LinkArrowIcon />
    </Link>
  );
}

export function BurgerMenu({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'bg-haqq-black z-50 px-[20px] py-[32px] sm:py-[40px] sm:pl-[40px] sm:pr-[64px]',
        'sm:border-l border-haqq-border overflow-y-auto',
        // 'backdrop-blur transform-gpu',
        className,
      )}
    >
      <div className="flex flex-col items-start space-y-[16px] mb-[60px] sm:mb-[80px]">
        <BurgerMenuNavLink href="/#about">About</BurgerMenuNavLink>
        {/* <BurgerMenuNavLink href="/#technology">Technology</BurgerMenuNavLink> */}
        <BurgerMenuNavLink href="/#developers">Developers</BurgerMenuNavLink>
        <BurgerMenuNavLink href="https://docs.haqq.network" isOutLink>
          Documentation
        </BurgerMenuNavLink>
        <Link href="/wallet">
          <Button variant={2} className="block sm:hidden">
            HAQQ Wallet
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-[14px] sm:gap-[18px] mb-[60px] sm:mb-[80px]">
        <BurgerMenuSocialLink
          href="https://discord.gg/4quqkD6Y8c"
          icon={
            <DiscordIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Discord
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="https://github.com/haqq-network"
          icon={
            <GithubIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Github
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="https://twitter.com/The_HaqqNetwork"
          icon={
            <TwitterIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
          }
        >
          Twitter
        </BurgerMenuSocialLink>
        <BurgerMenuSocialLink
          href="https://t.me/islamiccoin_int"
          icon={
            <TelegramIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
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
