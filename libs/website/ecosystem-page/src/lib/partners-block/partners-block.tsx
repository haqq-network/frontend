import { Heading, OrangeLink, Tabs, Tab } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { Partners } from '../partners/partners';
import Link from 'next/link';

export enum PartnerType {
  Infrastructure = 'infrastructure',
  Wallet = 'wallet',
  DeFi = 'defi',
  Bridge = 'bridge',
  Payments = 'payments',
  Service = 'service',
}

export enum PartnerStatus {
  Live = 'live',
  Planned = 'planned',
}

export interface ParterCardProps {
  logo: ReactNode;
  name: string;
  description: string;
  type: PartnerType;
  status: PartnerStatus;
  link: string;
  className?: string;
}

function PartnerTypeOrStatus({
  status,
  type,
}: {
  status?: PartnerStatus;
  type?: PartnerType;
}) {
  let text = '';

  switch (status) {
    case PartnerStatus.Live:
      text = 'Live';
      break;
    case PartnerStatus.Planned:
      text = 'Planned';
      break;
    default:
      break;
  }

  if (!text) {
    switch (type) {
      case PartnerType.Infrastructure:
        text = 'Infrastructure';
        break;
      case PartnerType.Wallet:
        text = 'Wallet';
        break;
      case PartnerType.DeFi:
        text = 'DeFi';
        break;
      case PartnerType.Bridge:
        text = 'Bridge';
        break;
      case PartnerType.Payments:
        text = 'Payments';
        break;
      case PartnerType.Service:
        text = 'Service';
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={clsx(
        'text-[12px] leading-[1.5em] rounded-[2px] py-[6px] px-[10px] text-center border border-[#ffffff26]',
      )}
    >
      {text}
    </div>
  );
}

function ParterCard({
  logo,
  name,
  description,
  link,
  status,
  type,
  className,
}: ParterCardProps) {
  return (
    <div
      className={clsx(
        'p-[20px] flex flex-col justify-between bg-haqq-black h-[280px] md:h-[300px] lg:h-[330px]',
        className,
      )}
    >
      <div className="flex flex-col">
        {logo}
        <div className="text-[16px] leading-[1.2em] mt-[12px] font-serif">
          {name}
        </div>
      </div>
      <div className="flex flex-col gap-y-[12px]">
        <p className="text-[12px] leading-[1.5em] ">{description}</p>
        <div className="flex gap-x-[12px]">
          <PartnerTypeOrStatus status={status} />
          <PartnerTypeOrStatus type={type} />
        </div>
        <Link
          href={link}
          className={clsx(
            'text-[14px] font-[600] leading-[1.2em] text-haqq-orange hover:text-haqq-light-orange',
            'cursor-pointer transition-colors duration-100 ease-out',
            'inline-flex items-center gap-x-[4px]',
          )}
          rel="noopener noreferrer"
          target="_blank"
        >
          Website
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
              d="M12.2874 8.30374L12.2874 13.363L13.954 13.363L13.954 5.45857H6.04965V7.12523L11.1089 7.12523L4.28188 13.9522L5.46039 15.1307L12.2874 8.30374Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export function PartnersBlock() {
  const [tab, setTab] = useState<PartnerType | 'all-partners'>('all-partners');

  const filterPartnersByType = (
    partners: ParterCardProps[],
    type: PartnerType | 'all-partners',
  ) => {
    if (type === 'all-partners') {
      return partners;
    }

    return partners.filter((partner) => partner.type === type);
  };

  const filteredPartners = filterPartnersByType(Partners, tab);

  return (
    <section className="bg-white px-[16px] py-[68px] md:px-[48px] md:pt-[100px] md:pb-[130px] lg:px-[80px] lg:py-[140px] flex flex-col">
      <div className="flex items-center relative">
        <Heading className="text-haqq-black">Haqq ecosystem partners</Heading>
        <div className="flex items-center ml-[48px]">
          <div className="bg-haqq-black w-[16px] h-[16px]" />
          <div className="h-[1px] bg-[#0d0d0e3d] w-[1200px] absolute" />
        </div>
      </div>

      <Tabs className="mt-[28px] md:mt-[40px] lg:mt-[80px] overflow-x-scroll md:overflow-x-visible">
        <Tab
          isActive={tab === 'all-partners'}
          onClick={() => {
            setTab('all-partners');
          }}
        >
          All
        </Tab>
        <Tab
          isActive={tab === 'infrastructure'}
          onClick={() => {
            setTab(PartnerType.Infrastructure);
          }}
        >
          Infrastructure
        </Tab>
        <Tab
          isActive={tab === 'wallet'}
          onClick={() => {
            setTab(PartnerType.Wallet);
          }}
        >
          Wallet
        </Tab>
        <Tab
          isActive={tab === 'defi'}
          onClick={() => {
            setTab(PartnerType.DeFi);
          }}
        >
          DeFi
        </Tab>
        <Tab
          isActive={tab === 'bridge'}
          onClick={() => {
            setTab(PartnerType.Bridge);
          }}
        >
          Bridge
        </Tab>
        <Tab
          isActive={tab === 'payments'}
          onClick={() => {
            setTab(PartnerType.Payments);
          }}
        >
          Payments
        </Tab>
        <Tab
          isActive={tab === 'service'}
          onClick={() => {
            setTab(PartnerType.Service);
          }}
        >
          Service
        </Tab>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[28px] mt-[36px]">
        {filteredPartners.map((partner, i) => (
          <ParterCard
            key={`partner-${i + 1}`}
            type={partner.type}
            status={partner.status}
            name={partner.name}
            logo={partner.logo}
            link={partner.link}
            description={partner.description}
          />
        ))}
      </div>
    </section>
  );
}
