import { Heading } from '@haqq/haqq-website-ui-kit';
import Image from 'next/image';
import Link from 'next/link';
import halbornLogoImgData from '../assets/images/halbord-logo.svg';

interface Auditor {
  image: string;
  name: string;
  report: string;
}

export function AuditsPage() {
  return (
    <section className="overflow-x-clip">
      <div className="sunrise-background relative overflow-hidden px-[16px] py-[80px] md:px-[48px] md:py-[120px] lg:px-[80px]">
        <div className="font-serif text-[46px] font-medium uppercase leading-none sm:text-[80px] lg:text-[140px]">
          Audits
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
        <div className="mt-[28px] grid grid-cols-1 md:mt-[42px] md:grid-cols-2 lg:mt-[80px] lg:grid-cols-3">
          <AuditCard image={halbornLogoImgData} name="Halborn" report="as/s" />
        </div>
      </div>
    </section>
  );
}

function AuditCard({ image, name, report }: Auditor) {
  return (
    <div className="flex flex-col border border-[#0D0D0E4D] p-[20px]">
      <div className="self-center px-[44px] py-[100px] md:px-[28px] lg:px-[8px] 2xl:px-[68px]">
        <div className="relative h-[38px] w-[234px]">
          <Image src={image} alt={name} fill />
        </div>
      </div>
      <div className="text-haqq-black text-[12px] leading-[18px]">
        {name} audit
      </div>
      <Link
        className="text-haqq-orange hover:text-haqq-light-orange mt-[12px] flex w-fit flex-row items-center gap-x-[4px] text-[14px] font-[500] uppercase leading-[22px] transition-colors duration-300"
        href={report}
        download
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
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
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.2874 8.30374L12.2874 13.363H13.954L13.954 5.45857H6.04965V7.12523L11.1089 7.12523L4.28188 13.9522L5.46039 15.1307L12.2874 8.30374Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </div>
  );
}
