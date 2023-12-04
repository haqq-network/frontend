import { Heading } from '@haqq/haqq-website-ui-kit';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import halbornLogoImgData from '../assets/images/halborn-logo.svg';
import linesBgImgData from '../assets/images/lines.svg';
import clsx from 'clsx';

interface Auditor {
  logo: StaticImageData | string;
  name: string;
  report: string;
}

const audits: Auditor[] = [
  {
    logo: halbornLogoImgData,
    name: 'HAQQ Backend',
    report: '/assets/audits/haqq-backend-webapp-pentest-report.pdf',
  },
  {
    logo: halbornLogoImgData,
    name: 'HAQQ Coinomics',
    report: '/assets/audits/haqq-coinomics-cosmos-security-assessment.pdf',
  },
  {
    logo: halbornLogoImgData,
    name: 'HAQQ Vesting',
    report: '/assets/audits/haqq-vesting-cosmos-security.pdf',
  },
  {
    logo: halbornLogoImgData,
    name: 'HAQQ Social Smart Contract',
    report: '/assets/audits/haqq-social-smart-contract-security-assessment.pdf',
  },
];

export function AuditsPage() {
  console.log(halbornLogoImgData, 'ASJHDHG');
  return (
    <section className="overflow-x-clip">
      <div className="sunrise-background relative overflow-hidden px-[16px] py-[80px] md:px-[48px] md:py-[120px] lg:px-[80px]">
        <div className="font-serif text-[46px] font-medium uppercase leading-none sm:text-[80px] lg:text-[140px]">
          Audits
        </div>
        <div
          className={clsx(
            'absolute bottom-0 right-[50%] z-[-1] h-[325px] w-[897px] translate-x-[62%] translate-y-[11%]',
            'md:translate-x-[82%] md:translate-y-[-17%]',
            'lg:translate-x-[108%] lg:translate-y-[-23%]',
            '2xl:translate-x-[100%]',
          )}
        >
          <Image src={linesBgImgData} fill alt="" />
        </div>
      </div>
      <div className="text-haqq-black flex flex-col bg-white px-[16px] py-[68px] md:px-[48px] md:pb-[130px] md:pt-[100px] lg:px-[80px] lg:py-[140px]">
        <div className="relative flex items-center">
          <Heading>HAQQ audits</Heading>
          <div className="ml-[48px] flex items-center">
            <div className="bg-haqq-black h-[16px] w-[16px]" />
            <div className="absolute h-[1px] w-[1200px] bg-[#0d0d0e3d]" />
          </div>
        </div>
        <div className="mt-[20px] w-full md:mt-[24px] lg:mt-[30px] lg:w-[90%] 2xl:w-[60%]">
          <div className="font-serif text-[14px] font-[500] leading-[18px] md:text-[16px] md:leading-[22px]">
            We conduct third-party audits of applications and infrastructure to
            provide you with the most secure solutions
          </div>
        </div>
        <div className="mt-[28px] grid grid-cols-1 gap-[28px] md:mt-[42px] md:grid-cols-2 lg:mt-[80px] lg:grid-cols-3">
          {audits.map((audit) => {
            return (
              <AuditCard
                key={audit.name}
                logo={audit.logo}
                name={audit.name}
                report={audit.report}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AuditCard({ logo, name, report }: Auditor) {
  return (
    <div className="flex flex-col border border-[#0D0D0E4D] p-[20px]">
      <div className="relative self-center px-[44px] py-[100px] md:px-[28px] lg:px-[8px] 2xl:px-[68px]">
        <Image src={logo} alt={`${name} Logo`} />
      </div>
      <div className="text-haqq-black text-[12px] leading-[18px]">{name}</div>
      <Link
        className="text-haqq-orange hover:text-haqq-light-orange mt-[12px] flex w-fit flex-row items-center gap-x-[4px] text-[14px] font-[500] uppercase leading-[22px] transition-colors duration-300"
        href={report}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.41667 16.25H14.5833V9.16665H10.1667C9.61438 9.16665 9.16667 8.71893 9.16667 8.16665V3.74998H5.41667V16.25ZM13.893 7.49998L10.8333 4.44034V7.49998H13.893ZM15.4167 17.9166H4.58333C4.1231 17.9166 3.75 17.5435 3.75 17.0833V2.91665C3.75 2.45641 4.1231 2.08331 4.58333 2.08331H10.4882C10.7092 2.08331 10.9211 2.17111 11.0774 2.32739L16.0059 7.2559C16.1622 7.41218 16.25 7.62414 16.25 7.84516V17.0833C16.25 17.5435 15.8769 17.9166 15.4167 17.9166Z"
            fill="currentColor"
          />
        </svg>
        Pdf
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.2874 8.30374L12.2874 13.363H13.954L13.954 5.45857H6.04965V7.12523L11.1089 7.12523L4.28188 13.9522L5.46039 15.1307L12.2874 8.30374Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </div>
  );
}
