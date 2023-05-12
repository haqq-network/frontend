import { PropsWithChildren } from 'react';
import { bondStatusFromJSON } from 'cosmjs-types/cosmos/staking/v1beta1/staking';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface ValidatorListItemProps {
  name: string;
  status?: string;
  fee: number;
  votingPower: number;
  votingPowerPercent: number;
  staked: number;
  reward: number;
  address: string;
  jailed?: boolean;
}

function ColumnLine({
  children,
  columnName,
}: PropsWithChildren<{ columnName: string }>) {
  return (
    <div className="flex items-center justify-between text-[13px] leading-[20px]">
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
  address,
  jailed,
}: ValidatorListItemProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full flex-col px-[8px] py-[12px]"
      onClick={() => navigate(`validator/${address}`)}
    >
      <ColumnLine columnName="Name">
        <span className="text-white">{name}</span>
      </ColumnLine>
      <ColumnLine columnName="Status">
        <span
          className={clsx(
            jailed && 'text-[#FF5454]',
            bondStatusFromJSON(status) === 3
              ? 'text-[#01B26E]'
              : 'text-[#E3A13F]',
          )}
        >
          {bondStatusFromJSON(status) === 3
            ? 'Active'
            : jailed
            ? 'Jailed'
            : 'Inactive'}
        </span>
      </ColumnLine>
      <ColumnLine columnName="Fee">
        <span className="text-white">{fee}%</span>
      </ColumnLine>
      <ColumnLine columnName="Voting power">
        <span className="text-white">{votingPower}</span>
      </ColumnLine>
      <ColumnLine columnName="Voting power %">
        <span className="text-white">{votingPowerPercent}%</span>
      </ColumnLine>
      <ColumnLine columnName="Staked">
        <span className="text-white">{staked}%</span>
      </ColumnLine>
      <ColumnLine columnName="Reward">
        <span className="text-white">{reward}%</span>
      </ColumnLine>
    </div>
  );
}
