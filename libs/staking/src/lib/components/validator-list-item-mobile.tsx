'use client';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import type { Validator, DelegationResponse, Reward } from '@evmos/provider';
import { useTranslate } from '@tolgee/react';
import { formatUnits, parseUnits } from 'viem';
import { formatNumber, Card } from '@haqq/shell-ui-kit/server';

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

export function ValidatorListItemMobileComponent({
  fee,
  validatorName,
  reward,
  staked,
  status,
  votingPower,
  votingPowerPercent,
}: ValidatorListItemMobileProps) {
  const { t } = useTranslate();
  return (
    <Card className="p-[14px]">
      <div className="flex flex-col gap-[8px]">
        <ColumnLine columnName="Name">
          <span className="text-white">{validatorName}</span>
        </ColumnLine>
        <ColumnLine columnName="Status">
          {status === 'jailed' && (
            <span className="text-[#FF5454]">
              {t('jailed-status', 'Jailed', { ns: 'staking' })}
            </span>
          )}
          {status === 'active' && (
            <span className="text-[#01B26E]">
              {t('active-status', 'Active', { ns: 'staking' })}
            </span>
          )}
          {status === 'inactive' && (
            <span className="text-[#E3A13F]">
              {t('inactive-status', 'Inactive', { ns: 'staking' })}
            </span>
          )}
        </ColumnLine>
        <ColumnLine columnName={t('fee', 'Fee', { ns: 'common' })}>
          <span className="text-white">{fee}</span>
        </ColumnLine>
        <ColumnLine
          columnName={t('voting-power', 'Voting power', { ns: 'staking' })}
        >
          <span className="text-white">{votingPower}</span>
        </ColumnLine>
        <ColumnLine
          columnName={`${t('voting-power', 'Voting power', { ns: 'staking' })} %`}
        >
          <span className="text-white">{votingPowerPercent}</span>
        </ColumnLine>
        <ColumnLine columnName={t('staked', 'Staked', { ns: 'common' })}>
          <span className="text-white">{staked}</span>
        </ColumnLine>
        <ColumnLine columnName={t('reward', 'Reward', { ns: 'staking' })}>
          <span className="text-white">{reward}</span>
        </ColumnLine>
      </div>
    </Card>
  );
}

export function ValidatorListItemMobile({
  validator,
  reward,
  delegation,
  stakingPool,
  onClick,
}: {
  validator: Validator;
  delegation?: DelegationResponse;
  reward?: Reward;
  stakingPool: number;
  onClick: (validatorAddress: string) => void;
}) {
  const validatorCommission = useMemo(() => {
    return (
      Number.parseFloat(validator.commission?.commission_rates?.rate ?? '0') *
      100
    ).toFixed(0);
  }, [validator.commission?.commission_rates]);
  const votingPower = useMemo(() => {
    return Number.parseFloat(formatUnits(BigInt(validator.tokens), 18));
  }, [validator.tokens]);
  const userDelegate = useMemo(() => {
    if (delegation?.balance) {
      return Number.parseFloat(
        formatUnits(BigInt(delegation.balance.amount), 18),
      );
    }

    return 0;
  }, [delegation]);
  const userRewards = useMemo(() => {
    if (reward?.reward.length) {
      return Number.parseFloat(
        formatUnits(parseUnits(reward.reward[0].amount, 0), 18),
      );
    }

    return 0;
  }, [reward]);
  const votingPowerInPercents = useMemo(() => {
    return ((votingPower / stakingPool) * 100).toFixed(2);
  }, [votingPower, stakingPool]);

  const getStatus = useCallback(() => {
    if (validator.jailed) {
      return 'jailed';
    }

    if (validator.status === 'BOND_STATUS_BONDED') {
      return 'active';
    }

    return 'inactive';
  }, [validator.jailed, validator.status]);

  return (
    <div
      onClick={() => {
        onClick(validator.operator_address);
      }}
    >
      <ValidatorListItemMobileComponent
        validatorName={validator.description.moniker}
        fee={`${validatorCommission}%`}
        reward={formatNumber(userRewards)}
        staked={formatNumber(userDelegate)}
        votingPowerPercent={votingPowerInPercents}
        votingPower={formatNumber(votingPower)}
        status={getStatus()}
      />
    </div>
  );
}
