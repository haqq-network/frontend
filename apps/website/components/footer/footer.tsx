import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import logoImageData from '../../assets/images/logo.svg';
import {
  DiscordIcon,
  GithubIcon,
  Heading,
  LinkArrowIcon,
  TelegramIcon,
  TwitterIcon,
} from '@haqq/website/ui-kit';
import { SubscribeForm } from '@haqq/website/forms';

function FooterNavLink({
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
      className="text-[12px] leading-[20px] text-white/50 transition-colors duration-100 hover:text-white sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px]"
      {...additionalProps}
    >
      {children}
    </Link>
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

export function Footer() {
  const [inputSize, setInputSize] = useState<'normal' | 'small'>('normal');

  useEffect(() => {
    const sizes = { sm: '640px', lg: '1024px' };
    const query = `(min-width: ${sizes['lg']})`;
    const { matches } = window.matchMedia(query);

    setInputSize(matches ? 'normal' : 'small');
  }, []);

  return (
    <footer
      className={clsx(
        'border-haqq-border bg-haqq-black z-10 flex flex-col border-b border-t',
      )}
    >
      <div className="border-haqq-border flex h-[63px] w-full flex-row items-center border-b sm:h-[72px] lg:mx-auto">
        <div className="border-haqq-border flex h-full w-[48px] items-center justify-center border-r sm:w-[64px] lg:w-[80px]">
          <div className="relative h-[26px] w-[26px] sm:h-[32px] sm:w-[32px]">
            <Image src={logoImageData} alt="HAQQ" fill />
          </div>
        </div>
        <div className="ml-[12px] font-serif text-[20px] font-medium leading-none sm:ml-[20px] sm:text-[24px] lg:ml-[32px]">
          HAQQ
        </div>
      </div>
      <div className="flex w-full flex-col lg:mx-auto lg:flex-row">
        <div className="border-haqq-border flex flex-row border-b lg:h-auto lg:border-b-0">
          <div className="border-haqq-border ml-[16px] flex-1 border-l border-r py-[24px] pl-[16px] sm:ml-[63px] sm:px-[34px] sm:py-[56px] lg:ml-[79px] lg:w-[212px]">
            <nav className="flex flex-col space-y-[8px] sm:space-y-[12px]">
              <FooterNavLink href="/#about">About</FooterNavLink>
              <FooterNavLink href="/ecosystem-fund">Fund</FooterNavLink>
              {/* <FooterNavLink href="#technology">Technology</FooterNavLink> */}
              <FooterNavLink href="/#developers">Developers</FooterNavLink>
              <FooterNavLink href="https://docs.haqq.network" isOutLink>
                Documentation
              </FooterNavLink>
              <FooterNavLink href="/brand-assets">Brand assets</FooterNavLink>
              {/* <FooterNavLink href="/privacy-policy">
                Privacy Policy
              </FooterNavLink> */}
              {/* <FooterNavLink href="/terms-and-conditions">
                Terms and Conditions
              </FooterNavLink> */}
            </nav>
          </div>
          <div className="h-full flex-1 py-[24px] pl-[16px] sm:px-[34px] sm:py-[56px] lg:w-[383px]">
            <nav className="grid grid-cols-1 gap-[8px] sm:grid-cols-2 sm:gap-[12px] lg:grid-cols-1">
              <FooterNavSocialLink
                href="https://discord.gg/4quqkD6Y8c"
                icon={
                  <DiscordIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
                }
              >
                Discord
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="https://github.com/haqq-network"
                icon={
                  <GithubIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
                }
              >
                Github
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="https://twitter.com/The_HaqqNetwork"
                icon={
                  <TwitterIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
                }
              >
                Twitter
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="https://t.me/islamiccoin_int"
                icon={
                  <TelegramIcon className="mt-[-2px] h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] lg:h-[26px] lg:w-[26px]" />
                }
              >
                Telegram
              </FooterNavSocialLink>
              {/* <FooterNavSocialLink
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
              </FooterNavSocialLink> */}
            </nav>
          </div>
        </div>
        <div className="flex flex-1 flex-row sm:h-[210px] lg:h-auto">
          <div className="border-haqq-border ml-[16px] flex-1 border-l px-[16px] py-[32px] sm:ml-[63px] sm:px-[34px] sm:py-[56px] lg:ml-0">
            <Heading level={3} className="mb-[16px] sm:mb-[24px]">
              Sign up for HAQQ updates
            </Heading>
            <SubscribeForm
              className="flex flex-col sm:flex-row sm:space-x-[24px] lg:flex-col lg:space-x-0"
              inputSize={inputSize}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
