import {
  Container,
  Member,
  MembersContainer,
} from '@haqq/islamic-website-ui-kit';
import Image from 'next/image';
import teamPageBgImageData from '../../assets/images/team-page-bg.svg';
import { useTranslations } from 'next-intl';

function TeamPageBg() {
  return (
    <div className="absolute right-[-145px] top-[-130px] z-[-1] h-[380px] w-[400px] md:right-[-600px] md:top-[-300px] md:h-[954px] md:w-[1000px] xl:right-[-360px] xl:top-[-320px]">
      <Image src={teamPageBgImageData} fill alt="" />
    </div>
  );
}

// const Founders = [
//   {
//     image: '/assets/images/founders/andrey-kuznetsov.png',
//     title: 'kuznetsov.title',
//     description: 'kuznetsov.description',
//     url: 'https://www.linkedin.com/in/brainsmith/',
//   },
//   {
//     image: '/assets/images/founders/alex-malkov.png',
//     title: 'malkov.title',
//     description: 'malkov.title',
//     url: 'https://www.linkedin.com/in/probono42/',
//   },
//   {
//     image: '/assets/images/founders/mohammed-alkaff-alhashmi.png',
//     title: 'alkaff.title',
//     description: 'alkaff.description',
//     url: 'https://www.linkedin.com/in/mohammed-alkaff-alhashmi-19688054/',
//   },
//   {
//     image: '/assets/images/founders/hussein-al-meeza.png',
//     title: 'al-meeza.title',
//     description: 'al-meeza.description',
//     url: 'http://www.almeeza.com/biography.php',
//   },
// ];

export function TeamPage({ teamMembers }: { teamMembers: Member[] }) {
  const t = useTranslations('team-page');

  return (
    <div className="overflow-x-clip">
      <Container className="relative">
        <div className="pb-[60px] pt-[32px] text-white md:pt-[52px] lg:pb-[200px] lg:pt-[68px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            {t('title')}
          </h1>

          <MembersContainer
            members={teamMembers}
            className="mt-[32px] lg:mt-[100px]"
          />

          <TeamPageBg />
        </div>
      </Container>
    </div>
  );
}
