import Link from 'next/link';
import { PropsWithChildren } from 'react';
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  RedditIcon,
  SustainableDevIcon,
  TelegramIcon,
  TwitterIcon,
  WorldGreenOrgIcon,
  YoutubeIcon,
  ZenIcon,
  Container,
} from '@haqq/islamic-ui-kit';

interface FooterNavLinkProps {
  url: string;
  isOutLink?: boolean;
  title: string;
}

type FooterNavSocialLinkProps = Pick<FooterNavLinkProps, 'url'>;

function FooterNavLink({ url, isOutLink, title }: FooterNavLinkProps) {
  return (
    <Link
      href={url}
      target={isOutLink ? '_blank' : undefined}
      rel={isOutLink ? 'noopener noreferrer' : undefined}
      className="w-fit px-[8px] py-[6px] font-mono text-base font-[400] uppercase text-[#F5F5F5] transition-colors duration-300 hover:text-[#18FFAC]"
    >
      {title}
    </Link>
  );
}

function FooterNavSocialLink({
  url,
  children,
}: PropsWithChildren<FooterNavSocialLinkProps>) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors duration-300 hover:text-[#18FFAC]"
    >
      {children}
    </Link>
  );
}

const FooterNavLinks: FooterNavLinkProps[] = [
  {
    url: '/about',
    title: 'About us',
  },
  {
    url: '/executive-board',
    title: 'Executive Board',
  },
  {
    url: '/press',
    title: 'For press',
  },
  {
    url: '/partnerships',
    title: 'Partnerships',
  },
  {
    url: '/whitepaper',
    title: 'Whitepaper',
  },
  {
    url: '/fatwa',
    title: 'Fatwa',
  },
  {
    url: 'https://haqq.network',
    title: 'Haqq Network',
    isOutLink: true,
  },
  {
    url: '/media',
    title: 'Islm in media',
  },
  {
    url: '/wallets',
    title: 'Wallets',
  },
  {
    url: '/get-islm',
    title: 'Get Islm',
  },
  {
    url: '/hodling',
    title: 'Hodling',
  },
  {
    url: '/docs',
    title: 'Haqq Docs',
  },
  {
    url: '/community-hub',
    title: 'Community Hub',
  },
  {
    url: '/grants',
    title: 'Grants',
  },
  {
    url: '/join-us',
    title: 'Join us',
  },
  {
    url: 'https://app.haqq.network',
    title: 'Delegate Islm',
    isOutLink: true,
  },
];

export function Footer() {
  return (
    <footer className="flex w-full flex-col text-white">
      <div className="border-y border-[#2F2F2F] py-[32px] md:py-[56px] lg:py-[80px]">
        <Container>
          <div className="flex flex-col gap-y-[32px] lg:gap-y-[60px]">
            <div className="grid grid-cols-2 gap-x-[20px] md:grid-cols-3 lg:grid-cols-5">
              {FooterNavLinks.map((el) => {
                return (
                  <FooterNavLink
                    key={el.title}
                    title={el.title}
                    url={el.url}
                    isOutLink={el.isOutLink}
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
                <FooterNavSocialLink url="https://www.facebook.com/groups/islamiccoin">
                  <FacebookIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://github.com/haqq-network">
                  <GithubIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://www.linkedin.com/company/islamiccoin">
                  <LinkedinIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://medium.com/islamic-coin">
                  <MediumIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://www.reddit.com/user/islamiccoin_net">
                  <RedditIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://t.me/islamiccoin_int">
                  <TelegramIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://twitter.com/Islamic_coin">
                  <TwitterIcon />
                </FooterNavSocialLink>
                <FooterNavSocialLink url="https://zen.yandex.ru/id/61d886b1a243b758ed11c321">
                  <ZenIcon />
                </FooterNavSocialLink>
              </div>
              <div className="mt-[28px] flex items-center gap-x-[12px] md:mt-0">
                <WorldGreenOrgIcon />
                <SustainableDevIcon />
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
            <div>Islamic Coin</div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
