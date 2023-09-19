import Link from 'next/link';
import { PropsWithChildren } from 'react';
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
  ZenIcon,
} from '../icons';
import { Container } from '../container/container';

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
      className="px-[8px] py-[4px] text-base font-[400] uppercase text-[#F5F5F5] transition-colors duration-300 hover:text-[#18FFAC]"
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
    <footer className="flex w-full flex-col ">
      <div className="border-y border-[#2F2F2F] py-[80px]">
        <Container>
          <div className="flex flex-col gap-y-[60px]">
            <div className="grid grid-cols-5 gap-x-[20px]">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-[14px] py-[12px]">
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
            </div>
          </div>
        </Container>
      </div>
      <Container className="mx-0 flex items-center justify-between py-[36px] text-center text-[14px] font-[400] leading-[20px]">
        <div>{`©${new Date().getFullYear()} Islamic Coin All rights
        reserved`}</div>
        <div>Islamic Coin</div>
      </Container>
    </footer>
  );
}
