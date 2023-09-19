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

export const DEPLOY_URL = `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`;
export const STORYBLOK_ACCESS_TOKEN =
  process.env['ISLAMIC_STORYBLOK_ACCESS_TOKEN'];
export const VERCEL_ENV = process.env['VERCEL_ENV'];
export const REVALIDATE_TIME = 3600;
export const FALCONER_ENDPOINT = process.env['FALCONER_ENDPOINT'];
export const TURNSTILE_SITEKEY = process.env['TURNSTILE_SITEKEY'];
export const SUPPORTED_LOCALES = ['en', 'ar'];
export const SOCIAL_LINKS = [
  {
    icon: <YoutubeIcon />,
    url: 'https://www.youtube.com/channel/UCTjvOCTDeO9H67y_6btF1NA',
    title: 'Youtube',
  },
  {
    icon: <DiscordIcon />,
    url: 'https://discord.gg/islamiccoin',
    title: 'Discord',
  },
  {
    icon: <FacebookIcon />,
    url: 'https://www.facebook.com/groups/islamiccoin',
    title: 'Facebook',
  },
  {
    icon: <GithubIcon />,
    url: 'https://github.com/haqq-network',
    title: 'Github',
  },
  {
    icon: <LinkedinIcon />,
    url: 'https://www.linkedin.com/company/islamiccoin',
    title: 'Linkedin',
  },
  {
    icon: <MediumIcon />,
    url: 'https://medium.com/islamic-coin',
    title: 'Medium',
  },
  {
    icon: <TelegramIcon />,
    url: 'https://t.me/islamiccoin_int',
    title: 'Telegram',
  },
  {
    icon: <TwitterIcon />,
    url: 'https://twitter.com/Islamic_coin',
    title: 'Twitter',
  },
];
