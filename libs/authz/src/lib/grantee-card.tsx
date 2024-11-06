'use client';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslate } from '@tolgee/react';
import clsx from 'clsx';
import { formatUnits, parseUnits } from 'viem';
import {
  useClipboard,
  useStakingDelegationQuery,
  useStakingRewardsQuery,
  useStakingUnbondingsQuery,
} from '@haqq/shell-shared';
import { Tooltip } from '@haqq/shell-ui-kit';
import { CopyIcon, Heading, formatNumber } from '@haqq/shell-ui-kit/server';

export function MyAccountCardBlock({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <div className="flex flex-col items-start gap-y-[6px]">
      {title && (
        <div className="text-[10px] font-[500] uppercase leading-[12px] text-white/50 lg:text-[12px] lg:leading-[14px]">
          {title}
        </div>
      )}
      <div className="text-[16px] uppercase leading-[26px]">{children}</div>
    </div>
  );
}

function MyAccountAmountBlock({
  title,
  value,
  isGreen = false,
  valueClassName,
}: {
  title: string;
  value: string | ReactNode;
  isGreen?: boolean;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="mb-[6px] text-[12px] font-[500] uppercase leading-[1.2em] text-white/50">
        {title}
      </div>
      <div
        className={clsx(
          'font-[500]',
          isGreen
            ? 'font-clash text-[20px] leading-[26px] text-[#01B26E]'
            : 'font-guise text-[18px] leading-[28px] text-white',
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function GranteeCard({
  granteeAddresses,
}: {
  granteeAddresses: {
    eth: string;
    haqq: string;
  };
}) {
  const { t } = useTranslate();
  const [isEthAddressCopy, setEthAddressCopy] = useState<boolean>(false);
  const [isHaqqAddressCopy, setHaqqAddressCopy] = useState<boolean>(false);
  const { copyText } = useClipboard();
  const { data: delegationInfo } = useStakingDelegationQuery(
    granteeAddresses.haqq,
  );
  const { data: rewardsInfo } = useStakingRewardsQuery(granteeAddresses.haqq);
  const { data: undelegations } = useStakingUnbondingsQuery(
    granteeAddresses.haqq,
  );
  const symbol = 'ISLM';

  const handleEthAddressCopy = useCallback(async () => {
    if (granteeAddresses.eth) {
      await copyText(granteeAddresses.eth);
      setEthAddressCopy(true);

      setTimeout(() => {
        setEthAddressCopy(false);
      }, 2500);
    }
  }, [copyText, granteeAddresses.eth]);

  const handleHaqqAddressCopy = useCallback(async () => {
    if (granteeAddresses.haqq) {
      await copyText(granteeAddresses.haqq);
      setHaqqAddressCopy(true);

      setTimeout(() => {
        setHaqqAddressCopy(false);
      }, 2500);
    }
  }, [copyText, granteeAddresses.haqq]);

  const delegation = useMemo(() => {
    if (delegationInfo && delegationInfo.delegation_responses?.length > 0) {
      let del = 0;

      for (const delegation of delegationInfo.delegation_responses) {
        del = del + Number.parseInt(delegation.balance.amount, 10);
      }

      return Number.parseFloat(formatUnits(BigInt(del), 18));
    }

    return 0;
  }, [delegationInfo]);

  const rewards = useMemo(() => {
    if (rewardsInfo?.total?.length) {
      return Number.parseFloat(
        formatUnits(parseUnits(rewardsInfo.total[0].amount, 0), 18),
      );
    }

    return 0;
  }, [rewardsInfo]);

  const unbounded = useMemo(() => {
    const allUnbound: number[] = (undelegations ?? []).map((validator) => {
      let sum = 0;

      validator.entries.forEach((unbondingValue) => {
        sum += Number.parseFloat(unbondingValue.balance);
      });

      return sum;
    });

    const result = allUnbound.reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

    return Number.parseFloat(formatUnits(BigInt(result), 18));
  }, [undelegations]);

  return (
    <div className="flex w-full transform-gpu flex-col gap-[24px] overflow-hidden rounded-[8px] bg-[#FFFFFF14] px-[36px] py-[32px]">
      <div>
        <Heading level={3} className="mb-[-2px]">
          {t('selected-grantee', 'Selected grantee', { ns: 'authz' })}
        </Heading>
      </div>

      <div className="flex flex-col justify-between gap-[24px] md:min-h-[230px]">
        <div>
          <MyAccountAmountBlock
            title={t('address-label', 'Address', { ns: 'common' })}
            value={
              <div className="space-gap-2 font-guise flex flex-col items-start">
                <div>
                  <Tooltip
                    text={
                      isEthAddressCopy
                        ? t('copied', 'Copied!', { ns: 'common' })
                        : t('click-to-copy-value', 'Click to copy {value}', {
                            ns: 'common',
                            value: granteeAddresses.eth,
                          })
                    }
                  >
                    <div
                      className={clsx(
                        'inline-flex cursor-pointer flex-row items-center gap-x-[8px] transition-colors duration-100 ease-out hover:text-white/50',
                        'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                      )}
                      onClick={handleEthAddressCopy}
                    >
                      <div>{granteeAddresses.eth}</div>
                      <CopyIcon className="mb-[-2px]" />
                    </div>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip
                    text={
                      isHaqqAddressCopy
                        ? t('copied', 'Copied!', { ns: 'common' })
                        : t('click-to-copy-value', 'Click to copy {value}', {
                            ns: 'common',
                            value: granteeAddresses.haqq,
                          })
                    }
                  >
                    <div
                      className={clsx(
                        'inline-flex cursor-pointer flex-row items-center gap-x-[8px] transition-colors duration-100 ease-out hover:text-white/50',
                        'text-[12px] font-[500] leading-[18px] text-white md:text-[14px] md:leading-[22px]',
                      )}
                      onClick={handleHaqqAddressCopy}
                    >
                      <div>{granteeAddresses.haqq}</div>
                      <CopyIcon className="mb-[-2px]" />
                    </div>
                  </Tooltip>
                </div>
              </div>
            }
          />
        </div>

        <div className="flex flex-row flex-wrap gap-[16px]">
          <div className="flex-1">
            <MyAccountAmountBlock
              title={t('staked', 'Staked', { ns: 'common' })}
              value={`${formatNumber(delegation)} ${symbol.toLocaleUpperCase()}`}
            />
          </div>
          <div className="flex-1">
            <MyAccountAmountBlock
              title={t('rewards', 'Rewards', { ns: 'common' })}
              value={`${formatNumber(rewards)} ${symbol.toLocaleUpperCase()}`}
            />
          </div>
        </div>
        <div>
          <div className="flex-1">
            <MyAccountAmountBlock
              title={t('unbonding', 'Unbonding', { ns: 'common' })}
              value={`${formatNumber(unbounded)} ${symbol.toLocaleUpperCase()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
