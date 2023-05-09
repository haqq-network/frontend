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
      className="text-[12px] leading-[20px] sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px] text-white/50 hover:text-white transition-colors duration-100"
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
      className="text-[12px] leading-[20px] sm:text-[13px] sm:leading-[24px] lg:text-[16px] lg:leading-[26px] text-white/50 hover:text-white transition-colors duration-100 group inline-flex flex-row flex-initial space-x-2 items-center"
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
        'z-10 border-t border-b border-haqq-border flex flex-col bg-haqq-black',
      )}
    >
      <div className="lg:mx-auto w-full flex flex-row items-center h-[63px] sm:h-[72px] border-b border-haqq-border">
        <div className="w-[48px] sm:w-[64px] lg:w-[80px] h-full flex items-center justify-center border-r border-haqq-border">
          <div className="relative w-[26px] h-[26px] sm:w-[32px] sm:h-[32px]">
            <Image src={logoImageData} alt="HAQQ" fill />
          </div>
        </div>
        <div className="ml-[12px] sm:ml-[20px] lg:ml-[32px] font-serif font-medium text-[20px] sm:text-[24px] leading-none">
          HAQQ
        </div>
      </div>
      <div className="lg:mx-auto w-full flex flex-col lg:flex-row">
        <div className="flex flex-row lg:h-auto border-haqq-border border-b lg:border-b-0">
          <div className="ml-[16px] sm:ml-[63px] lg:ml-[79px] border-l border-r border-haqq-border py-[24px] sm:py-[56px] pl-[16px] sm:px-[34px] flex-1 lg:w-[212px]">
            <nav className="flex flex-col space-y-[8px] sm:space-y-[12px]">
              <FooterNavLink href="#about">About</FooterNavLink>
              <FooterNavLink href="/ecosystem-fund">Fund</FooterNavLink>
              {/* <FooterNavLink href="#technology">Technology</FooterNavLink> */}
              <FooterNavLink href="#developers">Developers</FooterNavLink>
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
          <div className="h-full py-[24px] sm:py-[56px] pl-[16px] sm:px-[34px] flex-1 lg:w-[383px]">
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] sm:gap-[12px] lg:grid-cols-1">
              <FooterNavSocialLink
                href="https://discord.gg/4quqkD6Y8c"
                icon={
                  <DiscordIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Discord
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="https://github.com/haqq-network"
                icon={
                  <GithubIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Github
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="https://twitter.com/The_HaqqNetwork"
                icon={
                  <TwitterIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
                }
              >
                Twitter
              </FooterNavSocialLink>
              <FooterNavSocialLink
                href="https://t.me/islamiccoin_int"
                icon={
                  <TelegramIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] mt-[-2px]" />
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
        <div className="flex flex-row flex-1 sm:h-[210px] lg:h-auto">
          <div className="ml-[16px] sm:ml-[63px] lg:ml-0 py-[32px] px-[16px] sm:py-[56px] sm:px-[34px] border-l border-haqq-border flex-1">
            <Heading level={3} className="mb-[16px] sm:mb-[24px]">
              Sign up for HAQQ updates
            </Heading>
            <SubscribeForm
              className="flex flex-col sm:flex-row lg:flex-col sm:space-x-[24px] lg:space-x-0"
              inputSize={inputSize}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
