import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { Heading, Tabs, Tab } from '@haqq/website/ui-kit';

export enum PartnerType {
  INFRASTRUCTURE = 'infrastructure',
  WALLET = 'wallet',
  DEFI = 'defi',
  BRIDGE = 'bridge',
  PAYMENTS = 'payments',
  SERVICE = 'service',
  INSTITUTIONAL = 'institutional',
}

export enum PartnerStatus {
  LIVE = 'live',
  PLANNED = 'planned',
}

export interface Partner {
  logoUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  name: string;
  description: string;
  type: PartnerType;
  status: PartnerStatus;
  link: string;
  className?: string;
  _uid?: string;
}

function PartnerTypeOrStatus({
  status,
  type,
}: {
  status?: PartnerStatus;
  type?: PartnerType;
}) {
  const text = useMemo(() => {
    if (status) {
      switch (status) {
        case PartnerStatus.LIVE:
          return 'Live';
        case PartnerStatus.PLANNED:
          return 'Planned';
        default:
          break;
      }
    } else if (type) {
      switch (type) {
        case PartnerType.INFRASTRUCTURE:
          return 'Infrastructure';
        case PartnerType.WALLET:
          return 'Wallet';
        case PartnerType.DEFI:
          return 'DeFi';
        case PartnerType.BRIDGE:
          return 'Bridge';
        case PartnerType.PAYMENTS:
          return 'Payments';
        case PartnerType.INSTITUTIONAL:
          return 'Institutional';
        case PartnerType.SERVICE:
          return 'Service';
      }
    } else {
      return undefined;
    }
  }, [status, type]);

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

function PartnerCard({
  logoUrl,
  name,
  description,
  link,
  status,
  type,
  className,
  logoHeight,
  logoWidth,
}: Partner) {
  return (
    <div
      className={clsx(
        'p-[20px] flex flex-col justify-between bg-haqq-black h-[280px] md:h-[300px] lg:h-[330px]',
        className,
      )}
    >
      <div className="flex flex-col relative">
        <Image
          src={logoUrl}
          alt={name}
          width={logoWidth}
          height={logoHeight}
          className="h-[36px]"
        />
        <div className="text-[16px] leading-[1.2em] mt-[12px]">{name}</div>
      </div>
      <div className="flex flex-col gap-y-[12px]">
        <p className="text-[12px] leading-[1.5em] ">{description}</p>
        <div className="flex gap-x-[12px]">
          <PartnerTypeOrStatus status={status} />
          <PartnerTypeOrStatus type={type} />
        </div>
        <div>
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
    </div>
  );
}

export function PartnersBlock({ partners }: { partners: Partner[] }) {
  const [tab, setTab] = useState<PartnerType | 'all-partners'>('all-partners');

  const filteredPartners = useMemo(() => {
    if (tab === 'all-partners') {
      return partners;
    }
    
    return partners.filter((partner) => {
      return partner.type === tab;
    });
  }, [partners, tab]);

  const imageDimensions = useCallback((logoUrl: string) => {
    return {
      width: Number(logoUrl.split('/')[5].split('x')[0]),
      height: Number(logoUrl.split('/')[5].split('x')[1]),
    };
  }, []);

  return (
    <section className="bg-white px-[16px] py-[68px] md:px-[48px] md:pt-[100px] md:pb-[130px] lg:px-[80px] lg:py-[140px] flex flex-col">
      <div className="flex items-center relative">
        <Heading className="text-haqq-black">Haqq ecosystem partners</Heading>
        <div className="flex items-center ml-[48px]">
          <div className="bg-haqq-black w-[16px] h-[16px]" />
          <div className="h-[1px] bg-[#0d0d0e3d] w-[1200px] absolute" />
        </div>
      </div>

      <Tabs className="mt-[28px] md:mt-[40px] lg:mt-[80px] overflow-x-scroll overflow-y-clip md:overflow-visible">
        <Tab
          isActive={tab === 'all-partners'}
          onClick={() => {
            setTab('all-partners');
          }}
        >
          All
        </Tab>
        <Tab
          isActive={tab === PartnerType.INFRASTRUCTURE}
          onClick={() => {
            setTab(PartnerType.INFRASTRUCTURE);
          }}
        >
          Infrastructure
        </Tab>
        <Tab
          isActive={tab === PartnerType.WALLET}
          onClick={() => {
            setTab(PartnerType.WALLET);
          }}
        >
          Wallet
        </Tab>
        <Tab
          isActive={tab === PartnerType.DEFI}
          onClick={() => {
            setTab(PartnerType.DEFI);
          }}
        >
          DeFi
        </Tab>
        <Tab
          isActive={tab === PartnerType.BRIDGE}
          onClick={() => {
            setTab(PartnerType.BRIDGE);
          }}
        >
          Bridge
        </Tab>
        <Tab
          isActive={tab === PartnerType.PAYMENTS}
          onClick={() => {
            setTab(PartnerType.PAYMENTS);
          }}
        >
          Payments
        </Tab>
        <Tab
          isActive={tab === PartnerType.SERVICE}
          onClick={() => {
            setTab(PartnerType.SERVICE);
          }}
        >
          Service
        </Tab>
        <Tab
          isActive={tab === PartnerType.INSTITUTIONAL}
          onClick={() => {
            setTab(PartnerType.INSTITUTIONAL);
          }}
        >
          Institutional
        </Tab>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[28px] mt-[36px]">
        {filteredPartners?.map((partner: Partner) => {
          return (
            <PartnerCard
              key={partner._uid}
              type={partner.type}
              status={partner.status}
              name={partner.name}
              logoUrl={partner.logoUrl}
              link={partner.link}
              description={partner.description}
              logoHeight={imageDimensions(partner.logoUrl).height}
              logoWidth={imageDimensions(partner.logoUrl).width}
            />
          );
        })}
      </div>
    </section>
  );
}
