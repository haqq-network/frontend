import { PropsWithChildren } from 'react';

function ColumnLine({
  children,
  columnName,
}: PropsWithChildren<{ columnName: string }>) {
  return (
    <div className="flex items-center justify-between px-[8px] text-[13px] leading-[20px]">
      <span className="text-white/50">{columnName}</span>
      {children}
    </div>
  );
}

export function ValidatorListItemMobile({
  fee,
  name,
  reward,
  staked,
  status,
  votingPower,
  votingPowerPercent,
}: {
  name: string;
  status: 'jailed' | 'active' | 'inactive';
  fee: string | number;
  votingPower: string | number;
  votingPowerPercent: string | number;
  staked: string | number;
  reward: string | number;
}) {
  return (
    <div className="flex min-w-[288px] flex-col gap-y-[12px] py-[12px]">
      <ColumnLine columnName="Name">
        <span className="text-white">{name}</span>
      </ColumnLine>
      <ColumnLine columnName="Status">
        {status === 'jailed' && <span className="text-[#FF5454]">Jailed</span>}
        {status === 'active' && <span className="text-[#01B26E]">Active</span>}
        {status === 'inactive' && (
          <span className="text-[#E3A13F]">Inactive</span>
        )}
      </ColumnLine>
      <ColumnLine columnName="Fee">
        <span className="text-white">{fee}</span>
      </ColumnLine>
      <ColumnLine columnName="Voting power">
        <span className="text-white">{votingPower}</span>
      </ColumnLine>
      <ColumnLine columnName="Voting power %">
        <span className="text-white">{votingPowerPercent}</span>
      </ColumnLine>
      <ColumnLine columnName="Staked">
        <span className="text-white">{staked}</span>
      </ColumnLine>
      <ColumnLine columnName="Reward">
        <span className="text-white">{reward}</span>
      </ColumnLine>
    </div>
  );
}
