import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@haqq/islamic-website-ui-kit';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const SOCIAL_ICONS: Record<string, ReactNode> = {
  youtube: <YoutubeIcon />,
  discord: <DiscordIcon />,
  facebook: <FacebookIcon />,
  github: <GithubIcon />,
  linkedin: <LinkedinIcon />,
  medium: <MediumIcon />,
  telegram: <TelegramIcon />,
  twitter: <TwitterIcon />,
};

export interface SocialIconLinkProps {
  id: string;
  title: string;
  url: string;
}

export function SocialIconLink({ id, title, url }: SocialIconLinkProps) {
  const icon = SOCIAL_ICONS[id];

  return (
    <Link
      title={title}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors duration-150 ease-in hover:text-[#18FFAC]"
    >
      {icon}
    </Link>
  );
}

export const SOCIAL_LINKS = [
  {
    id: 'youtube',
    url: 'https://www.youtube.com/channel/UCTjvOCTDeO9H67y_6btF1NA',
    title: 'Youtube',
  },
  {
    id: 'discord',
    url: 'https://discord.gg/islamiccoin',
    title: 'Discord',
  },
  {
    id: 'facebook',
    url: 'https://www.facebook.com/groups/islamiccoin',
    title: 'Facebook',
  },
  {
    id: 'github',
    url: 'https://github.com/haqq-network',
    title: 'Github',
  },
  {
    id: 'linkedin',
    url: 'https://www.linkedin.com/company/islamiccoin',
    title: 'Linkedin',
  },
  {
    id: 'medium',
    url: 'https://medium.com/islamic-coin',
    title: 'Medium',
  },
  {
    id: 'telegram',
    url: 'https://t.me/islamiccoin_int',
    title: 'Telegram',
  },
  {
    id: 'twitter',
    url: 'https://twitter.com/Islamic_coin',
    title: 'Twitter',
  },
];
