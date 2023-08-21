import { Container, MembersContainer } from '@haqq/islamic-ui-kit';
import Image from 'next/image';
import teamPageBgImageData from '../../assets/images/team-page-bg.svg';

function TeamPageBg() {
  return (
    <div className="absolute right-[-145px] top-[-130px] z-[-1] h-[380px] w-[400px] md:right-[-600px] md:top-[-300px] md:h-[954px] md:w-[1000px] xl:right-[-360px] xl:top-[-320px]">
      <Image src={teamPageBgImageData} fill alt="" />
    </div>
  );
}

const Founders = [
  {
    image: '/assets/images/founders/andrey-kuznetsov.png',
    title: 'Andrey Kuznetsov',
    description:
      'Andrey is a serial entrepreneur and engineer focused on fintech, cybersecurity, and network communication solutions. He has led teams that have built payment services, corporate messengers, blockchain staking services, and financial analysis software.',
    url: 'https://www.linkedin.com/in/brainsmith/',
  },
  {
    image: '/assets/images/founders/alex-malkov.png',
    title: 'Alex Malkov',
    description:
      '5+ years of legal consulting for leading blockchain and fintech platforms. Alex has advised AAVE, Bequant, Scalable Solutions, Nebula and others.',
    url: 'https://www.linkedin.com/in/probono42/',
  },
  {
    image: '/assets/images/founders/mohammed-alkaff-alhashmi.png',
    title: 'Mohammed AlKaff AlHashmi',
    description:
      'Mohammed AlKaff AlHashmi is a computer science engineer with more than 18 years of experience. With this accumulative experience he focuses on Industry 4.0, Artificial Intelligence, machine learning, Industrial automation, and IOTs. He started his career as an Intelligence Network Engineer at Huawei.',
    url: 'https://www.linkedin.com/in/mohammed-alkaff-alhashmi-19688054/',
  },
  {
    image: '/assets/images/founders/hussein-al-meeza.png',
    title: 'Hussein Mohammed Al Meeza',
    description:
      'Hussein Mohammed Al Meeza is an acclaimed award-winning banker with over 45 years of experience spanning the Islamic banking, finance and insurance sectors. A founding member of Emaar properties, Amlak Finance, Emaar Industries & Investments, Emaar Financial services, Dubai Islamic Insurance & Reinsurance Company (AMAN), Nawat, he was named Best Islamic Banking Personality in 2006. His professional career began in 1975 at the Dubai Islamic Bank (DIB), where he spent over 20 years developing the bank’s services, and still serves as Executive Director. As an emerging star of Islamic banking, he is the founder of Al Salam Banks in Sudan, Bahrain and Algeria, where he serves on various positions including Board Member, Vice Chairman and Chairman of the Executive Committee since 2015. He is also the Chairman of Al Salam Bank - Seychelles, Chairman of Top Enterprises L.L.C., Chairman of Lycée Francais Jean Mermoz L.L.C.',
    url: 'http://www.almeeza.com/biography.php',
  },
];

export function TeamPage() {
  return (
    <div className="overflow-x-clip">
      <Container className="relative">
        <div className="pb-[60px] pt-[32px] text-white md:pt-[52px] lg:pb-[200px] lg:pt-[68px]">
          <h1 className="text-[46px] font-[600] leading-[52px] md:text-[60px] md:leading-none lg:text-[80px]">
            Founders
          </h1>

          <MembersContainer
            members={Founders}
            className="mt-[32px] lg:mt-[100px]"
          />

          <TeamPageBg />
        </div>
      </Container>
    </div>
  );
}
