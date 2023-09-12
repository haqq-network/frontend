import { Container, Text } from '@haqq/islamic-website-ui-kit';
import { PropsWithChildren } from 'react';
import {
  YoutubeIcon,
  MediumIcon,
  TwitterIcon,
  DiscordIcon,
  TelegramIcon,
  LinkedinIcon,
} from '@haqq/islamic-website-ui-kit';
import Link from 'next/link';
import bgImgData from '../../assets/images/bg-image.svg';
import Image from 'next/image';

function SocialIconLink({ children, url }: PropsWithChildren<{ url: string }>) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer rounded-[12px] bg-[#2F2F2F] p-[16px] transition-colors duration-300 hover:bg-[#585858]"
    >
      {children}
    </Link>
  );
}

const socialLinks = [
  {
    icon: <YoutubeIcon />,
    url: 'https://www.youtube.com/channel/UCTjvOCTDeO9H67y_6btF1NA',
  },
  {
    icon: <MediumIcon />,
    url: 'https://medium.com/islamic-coin',
  },
  {
    icon: <TwitterIcon />,
    url: 'https://twitter.com/Islamic_coin',
  },
  {
    icon: <DiscordIcon />,
    url: 'https://discord.gg/islamiccoin',
  },
  {
    icon: <TelegramIcon />,
    url: 'https://t.me/islamiccoin_int',
  },
  {
    icon: <LinkedinIcon />,
    url: 'https://www.linkedin.com/company/islamiccoin',
  },
];

export function CommunityHubPage() {
  return (
    <Container>
      <div className="relative  pb-[60px] pt-[32px] md:pb-[120px] md:pt-[52px] lg:pb-[180px] lg:pt-[68px]">
        <div className="flex flex-col">
          <div className="max-w-[340px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[740px] min-[1440px]:max-w-[800px]">
            <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
              Online Community Hub
            </h1>
            <div className="mt-[24px] md:mt-[32px] lg:mt-[40px]">
              <Text size="small">
                Islamic Coin was built to bring Shariah-compliant digital money
                to the Muslim community and beyond. Wherever you are, we welcome
                your opinion and invite you to join our Channels and the
                conversation! Be a part of a new era of sustainable, ethical
                finance.
              </Text>
            </div>
          </div>
          <div className="mt-[32px] md:mt-[44px] lg:mt-[60px]">
            <Text isMono>Join our channels here:</Text>
          </div>
          <div className="mt-[16px] flex flex-wrap gap-[16px] md:mt-[20px] lg:mt-[24px]">
            {socialLinks.map(({ icon, url }) => {
              return (
                <SocialIconLink key={url} url={url}>
                  {icon}
                </SocialIconLink>
              );
            })}
          </div>
        </div>
        <div className="absolute right-[-75px] top-[-435px] z-[-1] translate-x-1/2 translate-y-1/2 md:right-[110px] md:top-[-535px] lg:right-[175px] lg:top-[-580px] xl:right-[145px] min-[1440px]:right-[275px] min-[1440px]:top-[-585px]">
          <div className="h-[741px] w-[1044px]">
            <Image src={bgImgData} alt="" fill />
          </div>
        </div>
      </div>
    </Container>
  );
}
