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
