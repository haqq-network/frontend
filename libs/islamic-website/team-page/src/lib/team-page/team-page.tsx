import { Container, MembersContainer } from '@haqq/islamic-website-ui-kit';
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
    role: 'Co-Founder, Chief Technical Officer',
  },
  {
    image: '/assets/images/founders/alex-malkov.png',
    title: 'Alex Malkov',
    description:
      '5+ years of legal consulting for leading blockchain and fintech platforms. Alex has advised AAVE, Bequant, Scalable Solutions, Nebula and others.',
    url: 'https://www.linkedin.com/in/probono42/',
    role: 'Co-Founder, Chief Executive Officer',
  },
  {
    image: '/assets/images/founders/mohammed-alkaff-alhashmi.png',
    title: 'Mohammed AlKaff AlHashmi',
    description:
      'Mohammed AlKaff AlHashmi is a computer science engineer with more than 18 years of experience. With this accumulative experience he focuses on Industry 4.0, Artificial Intelligence, machine learning, Industrial automation, and IOTs. He started his career as an Intelligence Network Engineer at Huawei.',
    url: 'https://www.linkedin.com/in/mohammed-alkaff-alhashmi-19688054/',
    role: 'Co-Founder, Member of the Executive Board',
  },
  {
    image: '/assets/images/founders/hussein-al-meeza.png',
    title: 'Hussein Mohammed Al Meeza',
    description:
      'Hussein Mohammed Al Meeza is an acclaimed award-winning banker with over 45 years of experience spanning the Islamic banking, finance and insurance sectors. A founding member of Emaar properties, Amlak Finance, Emaar Industries & Investments, Emaar Financial services, Dubai Islamic Insurance & Reinsurance Company (AMAN), Nawat, he was named Best Islamic Banking Personality in 2006. His professional career began in 1975 at the Dubai Islamic Bank (DIB), where he spent over 20 years developing the bank’s services, and still serves as Executive Director. As an emerging star of Islamic banking, he is the founder of Al Salam Banks in Sudan, Bahrain and Algeria, where he serves on various positions including Board Member, Vice Chairman and Chairman of the Executive Committee since 2015. He is also the Chairman of Al Salam Bank - Seychelles, Chairman of Top Enterprises L.L.C., Chairman of Lycée Francais Jean Mermoz L.L.C.',
    url: 'http://www.almeeza.com/biography.php',
    role: 'Co-Founder, Member of the Executive Board',
  },
];

const Team = [
  {
    image: '/assets/images/team/evgenii-abramov.png',
    title: 'Evgenii Abramov',
    description:
      'A programming languages polyglot with vast experience in backend, web, and mobile development, focusing on speed, security, and UX. At HAQQ he leads the product development process while overseeing his own HAQQ node as well as partner integrations. Assisted the Telegram team with R&D solutions for video streaming on mobile devices under high loads. Previously excelled at: Rocketbank — Led backend development for a neobank. Actor — Developed an iOS app for an open-source messaging platform founded by ex-Telegram developers',
    role: 'Head of Development Division',
  },
  {
    image: '/assets/images/team/sergei-vorobev.png',
    title: 'Sergei Vorobev',
    description:
      "Senior Systems Analyst and Solution Architect. I have been developing software for more than 10 years, taught at the university for several years in parallel, and I found my vocation in designing various technological solutions - products, interfaces, SDKs and managing a team to implement these solutions. Now I have been actively developing in the field of cryptography and blockchain technologies. I have a perfect technical background, a Master's in distributed computing systems and networks. I am working at the company HAQQ x IslamicCoin on the creation of an Ethics-first blockchain that welcomes sustainability-centered developers, validators, and open-source contributors as well as ethical innovators in sustainable Finance.",
    role: 'Senior System Analyst',
  },
  {
    image: '/assets/images/team/andrei-zolin.png',
    title: 'Andrei Zolin',
    description:
      "Andrei Zolin is an experienced Web3 developer. He has a rich background of involvement in Web3 projects and served a crucial role as a Solidity Developer at Islamic Coin. His expertise in Ethereum development is broadly acknowledged, providing guidance to teams and individuals on Ethereum projects. Andrei's journey demonstrates a combination of technical expertise and a progressive mindset in navigating the fast-changing blockchain environment.",
    role: 'Software Engineer',
  },
  {
    image: '/assets/images/team/nargiz-khanjanbayova.png',
    title: 'Nargiz Khanjanbayova',
    description:
      'International professional with more than 15 years of combined experience in Human Resources (PHRi, CHRM), Consulting, People and Business Management. Proven track records of success in such fields as talent management, performance management, organizational development, HR business partnering, training and development, change management, business development, organizational support & mentorship to employees and leaders. Strategized and executed the implementation of HR processes and programs that improved organizational performance and achieved bottom line results.',
    role: 'Chief Human Resources Officer',
  },
  {
    image: '/assets/images/team/jei-rahman.png',
    title: 'Jei Rahman',
    description:
      "Jei brings over 17 years of experience in the traditional finance sector, honed in the financial and business hub of London. With a background in aerospace engineering, he established a robust technical foundation, seamlessly transitioning into the world of finance. His early career focused on asset liability modeling for pension and insurance funds, with a keen emphasis on capital adequacy. Later, he collaborated closely with tier 1 investment banks and asset management firms, streamlining equity models by disconnecting them from dependent data vendors. Jei is an unwavering advocate for blockchain's transformative potential in traditional finance, foreseeing it as a catalyst for transparency, efficiency, and equitable financial access. His dedication to Islamic Coin x HAQQ Network is epitomized by his commitment to nurturing a diverse portfolio of blockchain projects through HAQQPad and HAQQ Labs. Collaborating with top venture capitalists and industry leaders, Jei strives to infuse traditional methodologies into the evaluation of groundbreaking projects. His profound passion lies in fostering a blockchain ecosystem that is forging the path to mainstream adoption, shaping the future of finance.",
    role: 'Chief Program Officer',
  },
  {
    image: '/assets/images/team/zain-awan.png',
    title: 'Zain Awan',
    description:
      'Zain is a distinguished C-Level Executive with a rich background in growth marketing and global team leadership, spanning several startups from Europe to the Middle East. His versatile roles have included Director of Marketing at Muzmatch (YCombinator), Head of Brand and Communication at Biconomy, and CMO at Advanced Blockchain AG, where he significantly elevated brand profiles and spearheaded impactful growth initiatives. Currently, Zain is intensely focused on leveraging his strategic insight to elevate HAQQ and Islamic Coin, formulating comprehensive global outreach strategies to serve communities universally. His collaborations with eminent organizations like the United Nations have imbued him with a deep understanding of global challenges and the transformative potential of technology. Zain’s insights into the Muslim community and his roles in various philanthropic entities underscore his commitment to excellence and transformative change. Holding a degree in Development Economics and Middle Eastern Studies from SOAS, he’s also pursuing an MPHIL at Cambridge University, delving into the role of digital media in transnational Muslim identities. His relentless pursuit of excellence is recognized through prestigious awards, including the Muslim News Awards for Excellence.',
    role: 'Chief Marketing Officer',
  },
  // {
  //   image: '/assets/images/team/shamrose-hamayun.png',
  //   title: 'Shamrose Hamayun',
  //   description: '',
  //   role: 'Digital Marketing Manager',
  // },
  {
    image: '/assets/images/team/bestun-ibrahim.png',
    title: 'Bestun Ibrahim',
    description:
      'Bestun infuses analytical prowess into our team, offering a diverse skill set spanning marketing, operations, and event management. With a keen interest in startups, he’s passionate about the transformative impact of emerging technologies on our daily lives.',
    role: 'Operations Marketing Lead',
  },
  {
    image: '/assets/images/team/victor-ugochukwu.png',
    title: 'Victor Ugochukwu',
    description:
      'Victor Ugochukwu, with a 7-year tenure as a Web3 content strategist, leads content at HAQQ and architects Islamic Coin’s narrative. His adept strategies foster engaging discourse, merging blockchain ethos with compelling narratives, driving both projects to new digital frontiers.',
    role: 'Content Lead',
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

          <MembersContainer
            members={Team}
            className="mt-[32px] lg:mt-[100px]"
          />

          <TeamPageBg />
        </div>
      </Container>
    </div>
  );
}
