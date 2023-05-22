import { Heading, OrangeLink, Text } from '@haqq/website/ui-kit';
import clsx from 'clsx';
import { ReactElement } from 'react';
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
}: ParterCardProps) {
  return (
    <div className="p-[20px] flex flex-col justify-between bg-haqq-black w-[300px] h-[330px]">
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
      <div className="flex gap-[28px] flex-wrap mt-[36px]">
        {Partners.map((partner) => (
          <ParterCard
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
