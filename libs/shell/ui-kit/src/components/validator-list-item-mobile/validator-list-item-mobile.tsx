import { PropsWithChildren } from 'react';
import { Card } from '../card/card';

function ColumnLine({
  children,
  columnName,
}: PropsWithChildren<{ columnName: string }>) {
  return (
    <div className="flex flex-row items-center justify-between text-[13px] leading-[24px]">
      <span className="text-white/50">{columnName}</span>
      {children}
    </div>
  );
}

export interface ValidatorListItemMobileProps {
  validatorName: string;
  status: 'jailed' | 'active' | 'inactive';
  fee: string | number;
  votingPower: string | number;
  votingPowerPercent: string | number;
  staked: string | number;
  reward: string | number;
}

export function ValidatorListItemMobile({
  fee,
  validatorName,
  reward,
  staked,
  status,
  votingPower,
  votingPowerPercent,
}: ValidatorListItemMobileProps) {
  return (
    <Card className="p-[14px]">
      <div className="flex flex-col gap-[8px]">
        <ColumnLine columnName="Name">
          <span className="text-white">{validatorName}</span>
        </ColumnLine>
        <ColumnLine columnName="Status">
          {status === 'jailed' && (
            <span className="text-[#FF5454]">Jailed</span>
          )}
          {status === 'active' && (
            <span className="text-[#01B26E]">Active</span>
          )}
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
    </Card>
  );
}
