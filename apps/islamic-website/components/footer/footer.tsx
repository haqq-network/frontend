import { ReactNode, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import {
  Container,
  DiscordIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@haqq/islamic-website-ui-kit';

const { Link } = createSharedPathnamesNavigation({
  locales: [
    'en',
    // 'ar', 'id'
  ],
});

interface FooterNavLink {
  url: string;
  isOutLink?: boolean;
  title: string;
}

const SOCIAL_ICONS: Record<string, ReactNode> = {
  youtube: <YoutubeIcon />,
  discord: <DiscordIcon />,
  github: <GithubIcon />,
  linkedin: <LinkedinIcon />,
  medium: <MediumIcon />,
  telegram: <TelegramIcon />,
  twitter: <TwitterIcon />,
};

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
      className="rtl:font-handjet ltr:font-vcr w-fit px-[8px] py-[6px] text-[13px] font-[400] uppercase leading-[20px] text-[#F5F5F5] transition-colors duration-150 ease-in hover:text-[#18FFAC] md:text-[14px] lg:text-base"
    >
      {title}
    </Link>
  );
}

function flattenArray<T>(nestedArray: T[][]): T[] {
  return nestedArray.reduce((flatArray, subArray) => {
    return flatArray.concat(subArray);
  }, []);
}

const footerNavLinks: FooterNavLinks = [
  [
    {
      url: '/shariah#fatwa',
      title: 'fatwa',
    },
    {
      url: '/whitepaper',
      title: 'whitepaper',
    },
    {
      url: '/contact-us',
      title: 'contact-us',
    },
  ],
  [
    {
      url: '/shariah#shariah-board',
      title: 'shariah-board',
    },
    {
      url: '/shariah#advisory-board',
      title: 'advisory-board',
    },
    {
      url: '/shariah#executive-board',
      title: 'executive-board',
    },
  ],
  [
    {
      url: '/news',
      title: 'islm-in-media',
    },
    {
      url: '/community-hub',
      title: 'community-hub',
    },
    {
      url: 'https://haqq.network/brand-assets',
      title: 'brand-assets',
      isOutLink: true,
    },
  ],
  [
    {
      url: 'https://haqq.network',
      title: 'haqq-network',
      isOutLink: true,
    },
    {
      url: 'https://docs.haqq.network/',
      title: 'haqq-docs',
      isOutLink: true,
    },
    {
      url: '/wallet',
      title: 'wallet',
    },
    {
      url: 'https://shell.haqq.network',
      title: 'stake-islm',
      isOutLink: true,
    },
  ],
  [
    {
      url: '/values',
      title: 'values',
    },
    {
      url: '/career',
      title: 'career',
    },
  ],
];

export function Footer({
  socialLinks,
}: {
  socialLinks: { id: string; title: string; url: string }[];
}) {
  const t = useTranslations('footer');

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
                          title={t(title)}
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
                    title={t(title)}
                    url={url}
                    isOutLink={isOutLink}
                  />
                );
              })}
            </div>
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[12px] text-white">
                {socialLinks.map(({ id, url, title }) => {
                  return (
                    <Link
                      title={title}
                      href={url}
                      key={id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-150 ease-in hover:text-[#18FFAC]"
                      data-attr={`community-${id}`}
                    >
                      {SOCIAL_ICONS[id]}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-[28px] flex items-center gap-x-[12px] md:mt-0 lg:gap-x-[32px]">
                <Link
                  href="https://wggos.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-[38px] w-[147px] grayscale transition-[filter] duration-300 hover:grayscale-0 md:h-[50px] md:w-[200px]"
                  aria-label="World Green Growth Organization"
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
                  className="relative h-[28px] w-[63px] grayscale transition-[filter] duration-300 hover:grayscale-0 md:h-[44px] md:w-[98px]"
                  aria-label="United Nation Sustainable Development"
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
