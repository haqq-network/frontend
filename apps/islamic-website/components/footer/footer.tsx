import Link from 'next/link';
import Image from 'next/image';
import { PropsWithChildren, useMemo } from 'react';
import {
  DiscordIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
  Container,
} from '@haqq/islamic-website-ui-kit';

interface FooterNavLink {
  url: string;
  isOutLink?: boolean;
  title: string;
}

type FooterNavLinks = Array<Array<FooterNavLink>>;

function FooterNavLink({
  url,
  isOutLink = false,
  title,
}: {
  url: string;
  isOutLink?: boolean;
  title: string;
}) {
  return (
    <Link
      href={url}
      target={isOutLink ? '_blank' : undefined}
      rel={isOutLink ? 'noopener noreferrer' : undefined}
      className="w-fit px-[8px] py-[6px] font-mono text-[13px] font-[400] uppercase leading-[20px] text-[#F5F5F5] transition-colors duration-150 ease-in hover:text-[#18FFAC] md:text-[14px] lg:text-base lg:text-base"
    >
      {title}
    </Link>
  );
}

function FooterNavSocialLink({
  url,
  children,
}: PropsWithChildren<{ url: string }>) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors duration-150 ease-in hover:text-[#18FFAC]"
    >
      {children}
    </Link>
  );
}

const footerNavLinks: FooterNavLinks = [
  [
    {
      url: '/shariah#fatwa',
      title: 'Fatwa',
    },
    {
      url: '/whitepaper',
      title: 'Whitepaper',
    },
    {
      url: '/privacy-policy',
      title: 'Privacy Policy',
    },
    {
      url: '/contact-us',
      title: 'Contact us',
    },
  ],
  [
    {
      url: '/shariah#shariah-board',
      title: 'Shariah Board',
    },
    {
      url: '/shariah#advisory-board',
      title: 'Advisory Board',
    },
    {
      url: '/shariah#executive-board',
      title: 'Executive Board',
    },
  ],
  [
    {
      url: '/news',
      title: 'ISLM in media',
    },
    {
      url: '/community-hub',
      title: 'Community Hub',
    },
  ],
  [
    {
      url: 'https://haqq.network',
      title: 'HAQQ Network',
      isOutLink: true,
    },
    {
      url: 'https://docs.haqq.network/',
      title: 'HAQQ Docs',
      isOutLink: true,
    },
    {
      url: '/wallet',
      title: 'Wallet',
    },
    {
      url: 'https://shell.haqq.network',
      title: 'Stake ISLM',
      isOutLink: true,
    },
  ],
  [
    {
      url: '/values',
      title: 'Our values',
    },
    {
      url: '/partnerships',
      title: 'Partnerships',
    },
    {
      url: '/career',
      title: 'Career',
    },
  ],
];

function flattenArray<T>(nestedArray: T[][]): T[] {
  return nestedArray.reduce((flatArray, subArray) => {
    return flatArray.concat(subArray);
  }, []);
}

export function Footer() {
  const maxHeight = useMemo(() => {
    return footerNavLinks.reduce((acc, el) => {
      return acc + el.length * 35;
    }, 0);
  }, []);

  const flattenedFooterNavLinksArray = useMemo(() => {
    return flattenArray(footerNavLinks);
  }, []);

  return (
    <footer className="flex w-full flex-col text-white">
      <div className="bg-islamic-bg-black/10 border-y border-[#2F2F2F] py-[32px] backdrop-blur md:py-[56px] lg:py-[80px]">
        <Container>
          <div className="flex flex-col gap-y-[32px] lg:gap-y-[60px]">
            <div className="hidden md:grid md:grid-cols-3 md:gap-[20px] lg:grid-cols-5">
              {footerNavLinks.map((column, colIndex) => {
                return (
                  <div
                    key={`footer-column-${colIndex}`}
                    className="flex flex-col"
                  >
                    {column.map(({ title, isOutLink, url }) => {
                      return (
                        <FooterNavLink
                          key={title}
                          title={title}
                          url={url}
                          isOutLink={isOutLink}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div
              className="flex flex-col flex-wrap gap-x-[20px] md:hidden"
              style={{
                maxHeight: `${maxHeight / 2}px`,
              }}
            >
              {flattenedFooterNavLinksArray.map(({ title, url, isOutLink }) => {
                return (
                  <FooterNavLink
                    key={title}
                    title={title}
                    url={url}
                    isOutLink={isOutLink}
                  />
                );
              })}
            </div>
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[12px] text-white">
                <FooterNavSocialLink url="https://www.youtube.com/channel/UCTjvOCTDeO9H67y_6btF1NA">
                  <YoutubeIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://discord.gg/islamiccoin">
                  <DiscordIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://github.com/haqq-network">
                  <GithubIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://www.linkedin.com/company/islamiccoin">
                  <LinkedinIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://blog.islamiccoin.net/">
                  <MediumIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://t.me/islamic_coin/">
                  <TelegramIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://twitter.com/Islamic_coin">
                  <TwitterIcon />
                </FooterNavSocialLink>
              </div>
              <div className="mt-[28px] flex items-center gap-x-[12px] md:mt-0 lg:gap-x-[32px]">
                <Link
                  href="https://wggos.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-[38px] w-[147px] grayscale md:h-[50px] md:w-[200px]"
                >
                  <Image
                    src="/assets/images/logos/world-green-icon.svg"
                    alt=""
                    fill
                  />
                </Link>
                <Link
                  href="https://sdgs.un.org/goals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-[28px] w-[63px] grayscale md:h-[44px] md:w-[98px]"
                >
                  <Image
                    src="/assets/images/logos/sustainable-dev-icon.svg"
                    alt=""
                    fill
                  />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="py-[16px] md:py-[24px] lg:py-[36px]">
        <Container>
          <div className="flex w-full items-center justify-between text-[12px] font-[300] leading-[18px] md:text-[13px] md:leading-[20px] lg:text-[14px] lg:leading-[20px]">
            <div>
              {`© ${new Date().getFullYear()} Islamic Coin. All rights
        reserved`}
            </div>
            <div>
              <Link
                href="mailto:hello@islamiccoin.net"
                className="transition-colors duration-150 ease-in hover:text-[#18FFAC]"
              >
                hello@islamiccoin.net
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
