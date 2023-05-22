import { Heading, OrangeLink, Tabs, Tab } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import { ReactElement, useState } from 'react';
import { Partners } from '../partners/partners';

type PartnerType =
  | 'infrastructure'
  | 'wallet'
  | 'defi'
  | 'bridge'
  | 'payments'
  | 'service';

type PartnerStatus = 'live' | 'planned';

export interface ParterCardProps {
  logo: ReactElement;
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
  return (
    <div
      className={clsx(
        'text-[12px] leading-[1.5em] rounded-[2px] py-[6px] px-[10px] text-center border border-[#ffffff26]',
      )}
    >
      {status === 'live' ? 'Live' : 'Planned'}
      {type === 'infrastructure' && 'Infrastructure'}
      {type === 'wallet' && 'Wallet'}
      {type === 'defi' && 'DeFi'}
      {type === 'bridge' && 'Bridge'}
      {type === 'payments' && 'Payments'}
      {type === 'service' && 'Service'}
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
        'p-[20px] flex flex-col justify-between bg-haqq-black h-[330px]',
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
        <OrangeLink
          href={link}
          withArrow
          rel="noopener noreferrer"
          target="_blank"
        >
          Website
        </OrangeLink>
      </div>
    </div>
  );
}

export function PartnersBlock() {
  const [tab, setTab] = useState('all-partners');
  return (
    <section className="bg-white px-[80px] py-[140px] flex flex-col">
      <div className="flex  items-center relative">
        <Heading className={clsx('text-haqq-black')}>
          Haqq ecosystem partners
        </Heading>
        <div className="flex items-center ml-[48px]">
          <div className="bg-haqq-black w-[16px] h-[16px]" />
          <div className="h-[1px] bg-[#0d0d0e3d] w-[1200px] absolute" />
        </div>
      </div>

      <Tabs className="mt-[80px] ">
        <Tab
          isActive={tab === 'all-partners'}
          onClick={() => setTab('all-partners')}
        >
          All partners
        </Tab>
        <Tab
          isActive={tab === 'infrastructure'}
          onClick={() => setTab('infrastructure')}
        >
          Infrastructure
        </Tab>
        <Tab isActive={tab === 'wallet'} onClick={() => setTab('wallet')}>
          Wallet
        </Tab>
        <Tab isActive={tab === 'defi'} onClick={() => setTab('defi')}>
          DeFi
        </Tab>
        <Tab isActive={tab === 'bridge'} onClick={() => setTab('bridge')}>
          Bridge
        </Tab>
        <Tab isActive={tab === 'payments'} onClick={() => setTab('payments')}>
          Payments
        </Tab>
        <Tab isActive={tab === 'service'} onClick={() => setTab('service')}>
          Service
        </Tab>
      </Tabs>

      <div className="flex gap-[28px] flex-wrap mt-[36px]">
        {Partners.map((partner, i) => (
          <ParterCard
            key={`partner-${i + 1}`}
            type={partner.type}
            status={partner.status}
            name={partner.name}
            logo={partner.logo}
            link={partner.link}
            description={partner.description}
            className="w-1/5"
          />
        ))}
      </div>
    </section>
  );
}
